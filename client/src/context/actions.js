export async function loginUser(dispatch, loginPayload) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(loginPayload),
	};

	try {
		dispatch({ type: "REQUEST_LOGIN" });
		let response = await fetch(`api/login`, requestOptions);
		let data = await response.json();

		if (data.user) {
			dispatch({ type: "LOGIN_SUCCESS", payload: data });
			return data;
		}

		dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
		return;
	} catch (error) {
		dispatch({ type: "LOGIN_ERROR", error: error });
	}
}

export async function logout(dispatch) {
	dispatch({ type: "LOGOUT" });
}
