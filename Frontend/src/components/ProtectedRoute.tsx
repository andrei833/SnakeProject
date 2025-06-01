import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
	children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		fetch("http://localhost:8080/auth/status", {
			method: "GET",
			credentials: "include",
		})
			.then((res) => {
				if (res.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					navigate("/auth", { replace: true });
				}
			})
			.catch(() => {
				setIsAuthenticated(null);
			});
	}, [navigate]);

	if (isAuthenticated === null)
		return <div>Loading... (or server is unreachable)</div>;

	if (!isAuthenticated) return null;

	return <>{children}</>;
}
