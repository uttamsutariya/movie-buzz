import React, { createContext, useReducer, useContext } from "react";
import { AuthReducer, initialState } from "./reducer";

// context for auth state
export const AuthStateContext = createContext();

// context for dispatch
export const AuthDispatchContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
	const [auth, dispatch] = useReducer(AuthReducer, initialState);

	return (
		<AuthStateContext.Provider value={auth}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	);
};
