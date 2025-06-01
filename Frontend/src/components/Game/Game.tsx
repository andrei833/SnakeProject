import { useCallback, useEffect, useRef, useState } from "react";

const unitSize = 25;
const gameWidth = 500;
const gameHeight = 500;

const initialSnake = [
	{ x: unitSize * 3, y: 0 },
	{ x: unitSize * 2, y: 0 },
	{ x: unitSize, y: 0 },
	{ x: 0, y: 0 },
];

type Point = { x: number; y: number };

type Move = {
	x: number;
	y: number;
	timestamp: string;
};

export default function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [snake, setSnake] = useState<Point[]>([...initialSnake]);
	const [food, setFood] = useState<Point>({ x: 0, y: 0 });
	const [obstacles, setObstacles] = useState<Point[]>([]);
	const [score, setScore] = useState(0);
	const [running, setRunning] = useState(false);
	const [startedAt, setStartedAt] = useState<Date | null>(null);
	const [endedAt, setEndedAt] = useState<Date | null>(null);
	const [moves, setMoves] = useState<Move[]>([]);

	const directionRef = useRef<Point>({ x: unitSize, y: 0 });
	const [direction, setDirection] = useState<Point>({ x: unitSize, y: 0 });

	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);

	// Move the snake every tick when running
	useEffect(() => {
		if (!running) return;

		const interval = setInterval(() => {
			nextTick();
		}, 105);

		return () => clearInterval(interval);
	}, [running, snake]);

	// Initialize food and obstacles once on mount or reset
	useEffect(() => {
		createFood();
		createObstacles();
	}, []);

	const createObstacles = useCallback(() => {
		const obs: Point[] = [];
		const numberOfObstacles = 10;

		while (obs.length < numberOfObstacles) {
			const x = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
			const y = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;

			const isOccupied =
				obs.some((o) => o.x === x && o.y === y) ||
				snake.some((part) => part.x === x && part.y === y) ||
				(food.x === x && food.y === y);

			if (!isOccupied) {
				obs.push({ x, y });
			}
		}
		setObstacles(obs);
	}, [snake, food]);

	const createFood = () => {
		const freeCells: Point[] = [];

		for (let x = 0; x < gameWidth; x += unitSize) {
			for (let y = 0; y < gameHeight; y += unitSize) {
				const isOccupied =
					snake.some((s) => s.x === x && s.y === y) ||
					obstacles.some((o) => o.x === x && o.y === y);
				if (!isOccupied) {
					freeCells.push({ x, y });
				}
			}
		}

		if (freeCells.length === 0) {
			// No free space left, game could be won or over
			console.warn("No space left for food!");
			return;
		}

		const randomIndex = Math.floor(Math.random() * freeCells.length);
		setFood(freeCells[randomIndex]);
	};

	const checkCollision = useCallback(
		(head: Point, body: Point[]) => {
			if (
				head.x < 0 ||
				head.x >= gameWidth ||
				head.y < 0 ||
				head.y >= gameHeight
			)
				return true;

			for (let i = 1; i < body.length; i++) {
				if (body[i].x === head.x && body[i].y === head.y) return true;
			}

			for (const obstacle of obstacles) {
				if (obstacle.x === head.x && obstacle.y === head.y) return true;
			}

			return false;
		},
		[obstacles]
	);

	const drawGame = useCallback(
		(snakeToDraw: Point[]) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, gameWidth, gameHeight);

			// Food
			ctx.fillStyle = "red";
			ctx.fillRect(food.x, food.y, unitSize, unitSize);

			// Obstacles
			ctx.fillStyle = "gray";
			obstacles.forEach(({ x, y }) => {
				ctx.fillRect(x, y, unitSize, unitSize);
			});

			// Snake
			ctx.fillStyle = "lightgreen";
			ctx.strokeStyle = "black";
			snakeToDraw.forEach((part) => {
				ctx.fillRect(part.x, part.y, unitSize, unitSize);
				ctx.strokeRect(part.x, part.y, unitSize, unitSize);
			});

			if (!running) {
				ctx.font = "50px MV Boli";
				ctx.fillStyle = "black";
				ctx.textAlign = "center";
				ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
			}
		},
		[food, obstacles, running]
	);

	function nextTick() {
		const dir = directionRef.current;

		const newHead = {
			x: snake[0].x + dir.x,
			y: snake[0].y + dir.y,
		};

		const newSnake = [newHead, ...snake];

		setMoves((prevMoves) => [
			...prevMoves,
			{ x: newHead.x, y: newHead.y, timestamp: new Date().toISOString() },
		]);

		if (newHead.x === food.x && newHead.y === food.y) {
			setScore((score) => score + 1);
			createFood();
		} else {
			newSnake.pop();
		}

		if (checkCollision(newHead, newSnake)) {
			setRunning(false);
			setEndedAt(new Date());
		} else {
			setSnake(newSnake);
			drawGame(newSnake);
		}
	}

	// Draw on snake, food, obstacles or running changes
	useEffect(() => {
		drawGame(snake);
	}, [snake, food, obstacles, drawGame]);

	// Send game data after endedAt is set
	useEffect(() => {
		if (!endedAt) return;

		async function sendGameData() {
			if (!startedAt) return;

			const gameData = {
				startedAt: startedAt.toISOString(),
				endedAt: endedAt ? endedAt.toISOString() : "",
				moves,
			};

			try {
				const response = await fetch("http://localhost:8080/api/game/save", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(gameData),
					credentials: "include",
				});

				if (!response.ok) {
					console.error("Failed to save game data");
				} else {
					console.log("Game data saved successfully");
				}
			} catch (err) {
				console.error("Error saving game data", err);
			}
		}

		sendGameData();
	}, [endedAt, moves, startedAt]);

	function changeDirection(event: KeyboardEvent) {
		if (!running) return;

		const keyPressed = event.key;
		const dir = directionRef.current;

		switch (keyPressed) {
			case "ArrowLeft":
				if (dir.x === 0) {
					const newDir = { x: -unitSize, y: 0 };
					setDirection(newDir);
					directionRef.current = newDir;
				}
				break;
			case "ArrowUp":
				if (dir.y === 0) {
					const newDir = { x: 0, y: -unitSize };
					setDirection(newDir);
					directionRef.current = newDir;
				}
				break;
			case "ArrowRight":
				if (dir.x === 0) {
					const newDir = { x: unitSize, y: 0 };
					setDirection(newDir);
					directionRef.current = newDir;
				}
				break;
			case "ArrowDown":
				if (dir.y === 0) {
					const newDir = { x: 0, y: unitSize };
					setDirection(newDir);
					directionRef.current = newDir;
				}
				break;
			default:
				break;
		}
	}

	// Change direction listener
	useEffect(() => {
		if (running) {
			window.addEventListener("keydown", changeDirection);
		} else {
			window.removeEventListener("keydown", changeDirection);
		}
		return () => window.removeEventListener("keydown", changeDirection);
	}, [running]);

	useEffect(() => {
		function handleSpace(event: KeyboardEvent) {
			if (event.code === "Space") {
				event.preventDefault();

				if (running) {
					resetGame();
				} else if (endedAt !== null) {
					resetGame();
				} else {
					startGame();
				}
			}
		}
		window.addEventListener("keydown", handleSpace);
		return () => window.removeEventListener("keydown", handleSpace);
	}, [running, endedAt]);

	function resetGame() {
		setSnake([...initialSnake]);
		const initialDirection = { x: unitSize, y: 0 };
		setDirection(initialDirection);
		directionRef.current = initialDirection;
		setScore(0);
		setMoves([]);
		createFood();
		createObstacles();
		setStartedAt(null);
		setEndedAt(null);
		setRunning(false);
		drawGame(initialSnake);
	}

	function startGame() {
		if (running) return;
		setStartedAt(new Date());
		setRunning(true);
	}

	return (
		<div id="gameContainer">
			<canvas
				id="gameBoard"
				ref={canvasRef}
				width={gameWidth}
				height={gameHeight}
				style={{ border: "1px solid black" }}
			/>
			<div id="scoreText">Score: {score}</div>
		</div>
	);
}
