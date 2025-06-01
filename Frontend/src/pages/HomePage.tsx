import { useEffect, useState } from "react";
import Game from "../components/Game/Game";

type User = { username: string };

const HomePage = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetch("http://localhost:8080/me", { credentials: "include" })
			.then((res) => (res.ok ? res.json() : null))
			.then(setUser)
			.catch(() => setUser(null));
	}, []);

	if (!user) {
		return (
			<>
				<h1>Loading...</h1>
			</>
		);
	}
	return (
		<>
			<h1>
				Welcome, {user.username}!<Game></Game>
			</h1>
		</>
	);
};

export default HomePage;
