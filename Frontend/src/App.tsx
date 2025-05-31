import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/auth/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Header />
							<HomePage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
