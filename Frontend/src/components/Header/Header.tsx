import { useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
	const navigator = useNavigate();
	const logout = () => {
		fetch("http://localhost:8080/logout", {
			method: "GET",
			credentials: "include",
		}).finally(() => {
			navigator("/auth", { replace: true });
		});
	};

	return (
		<div className="header">
			<div className="header-left">
				<img src="/logo.png" alt="Logo" className="header-logo" />
				<div className="header-title">Snake Game</div>
			</div>
			<div className="header-right">
				<button className="logout-button" onClick={logout}>
					Logout
				</button>
			</div>
		</div>
	);
}
