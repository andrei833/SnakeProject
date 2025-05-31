import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [invalid, setInvalid] = useState(false);
	const navigate = useNavigate();

	const handleLogin = () => {
		const params = new URLSearchParams();
		params.append("username", username);
		params.append("password", password);

		fetch("http://localhost:8080/login", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			credentials: "include",
			body: params.toString(),
		})
			.then((res) => {
				if (res.ok) {
					navigate("/", { replace: true });
				}
			})
			.finally(() => setInvalid(true));
	};

	return (
		<form
			className="login-form"
			onSubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
		>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{invalid ? (
				<p style={{ color: "red" }}>Invalid username or password</p>
			) : null}
			<button type="submit">Login</button>
		</form>
	);
};

export default LoginForm;
