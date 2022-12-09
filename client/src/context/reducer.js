export const initialState = {
	user: null,
	loading: false,
	error: null,
};

export const AuthReducer = (initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "REQUEST_LOGIN":
			return {
				...initialState,
				loading: true,
			};
		case "LOGIN_SUCCESS":
			return {
				...initialState,
				user: payload,
				loading: false,
			};
		case "LOGOUT":
			return {
				...initialState,
				user: null,
			};

		case "ERROR":
			return {
				...initialState,
				loading: false,
				error: payload,
			};

		default:
			return state;
	}
};
