import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "../context";

const PrivateRoute = ({ allowedRoles }) => {
	const { user } = useAuthState();
	const location = useLocation();

	return allowedRoles?.includes(user?.role) ? (
		<Outlet />
	) : user != null ? (
		<Navigate to={"/unauthorized"} state={{ from: location }} replace />
	) : (
		<Navigate to={"/login"} state={{ from: location }} replace />
	);
};

export default PrivateRoute;
