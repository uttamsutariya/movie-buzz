import { useAuthDispatch, useAuthState } from "../context";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "./util/Loader";
import axios from "axios";

const PersistLogin = () => {
	const dispatch = useAuthDispatch();
	const { user } = useAuthState();
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	async function loadUser() {
		try {
			const {
				data: {
					data: { user },
				},
			} = await axios.get("/api/user/load");

			dispatch({ type: "LOGIN_SUCCESS", payload: user });
		} catch (error) {
			if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		!user ? loadUser() : setLoading(false);
	}, []);

	return <>{loading ? <Loader msg="loading" /> : <Outlet />}</>;
};

export default PersistLogin;
