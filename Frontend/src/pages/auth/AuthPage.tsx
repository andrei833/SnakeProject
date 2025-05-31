import { useState } from "react";
import LoginForm from "../../components/Authentication/login/LoginForm";
import RegisterForm from "../../components/Authentication/register/RegisterForm";
import "./AuthFormContainer.css";
import "./AuthPage.css";

const AuthPage = () => {
	const [activeForm, setActiveForm] = useState("login");

	return (
		<div className="auth-page">
			<div className="button-row">
				<button
					className={`toggle-button ${activeForm === "login" ? "active" : ""}`}
					onClick={() => setActiveForm("login")}
				>
					Login
				</button>
				<button
					className={`toggle-button ${
						activeForm === "register" ? "active" : ""
					}`}
					onClick={() => setActiveForm("register")}
				>
					Register
				</button>
			</div>

			<div className="auth-form-container">
				{activeForm === "login" ? <LoginForm /> : <RegisterForm />}
			</div>
		</div>
	);
};

export default AuthPage;
