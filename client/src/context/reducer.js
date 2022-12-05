import { useReducer } from "react";

export const initialState = {
	user: {},
	loading: false,
	error: null,
};

export const AuthReducer = (initialState, action) => {
	switch (action.type) {
		case "REQUEST_LOGIN":
			return {
				...initialState,
				loading: true,
			};
		case "LOGIN_SUCCESS":
			return {
				...initialState,
				user: action.payload.user,
				loading: false,
			};
		case "LOGOUT":
			return {
				...initialState,
				user: "",
			};

		case "LOGIN_ERROR":
			return {
				...initialState,
				loading: false,
				error: action.error,
			};

		default:
			return state;
	}
};
