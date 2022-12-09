import axios from "axios";

// toast
import { toast } from "react-toastify";

export async function loginUser(dispatch, loginPayload) {
	try {
		dispatch({ type: "REQUEST_LOGIN" });
		let {
			data: {
				data: { user },
			},
		} = await axios.post(`api/user/login`, loginPayload);

		if (user) {
			dispatch({ type: "LOGIN_SUCCESS", payload: user });
			toast.success("Login success");
			return user;
		}
	} catch (error) {
		const errorMessage = error.response.data.message;
		dispatch({ type: "ERROR", payload: errorMessage });
		toast.error(errorMessage);
	}
}

export async function signupUser(dispatch, loginPayload) {
	try {
		dispatch({ type: "REQUEST_LOGIN" });
		let {
			data: {
				data: { user },
			},
		} = await axios.post(`api/user/signup`, loginPayload);

		if (user) {
			dispatch({ type: "LOGIN_SUCCESS", payload: user });
			toast.success("Signup success");
			return user;
		}
	} catch (error) {
		const errorMessage = error.response.data.message;
		dispatch({ type: "ERROR", payload: errorMessage });
		toast.error(errorMessage);
	}
}

export async function logout(dispatch) {
	dispatch({ type: "LOGOUT" });
}
