import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "../context";

const PrivateRoute = () => {
	const { user } = useAuthState();

	return <>{user != null ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

export default PrivateRoute;
