import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

export default function RegisterForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [error, setError] = useState("");
	const [serverMessage, setServerMessage] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (!password && !password2) {
			setError("");
			return;
		}

		if (password.length > 0 && password.length < 6) {
			setError("Password is too short.");
			return;
		}

		if (password !== password2) {
			setError("Passwords do not match.");
			return;
		}

		setError("");
	}, [password, password2]);

	const handleRegister = () => {
		if (error) return;

		fetch("http://localhost:8080/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				username,
				password,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					navigate("/");
				} else if (res.status === 409) {
					return res.text().then(setServerMessage); // Username already exists
				} else {
					setServerMessage("Registration failed.");
				}
			})
			.catch(() => {
				setServerMessage("Server error.");
			});
	};

	return (
		<form
			className="register-form"
			onSubmit={(e) => {
				e.preventDefault();
				handleRegister();
			}}
		>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				value={password2}
				onChange={(e) => setPassword2(e.target.value)}
				required
			/>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{serverMessage && <p style={{ color: "red" }}>{serverMessage}</p>}
			<button type="submit" disabled={!!error}>
				Register
			</button>
		</form>
	);
}
