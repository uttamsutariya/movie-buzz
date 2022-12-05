import { createContext, useReducer } from "react";
import { AuthReducer } from "./reducer";

// context for auth state
const AuthStateContext = createContext();

// context for dispatch
const AuthDispatchContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
	const [user, dispatch] = useReducer(AuthReducer, initialState);

	// return (
	// 	<AuthStateContext.Provider value={user}>
	// 		<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
	// 	</AuthStateContext.Provider>
	// );
};

// custom hooks that will help us read values from these context objects without having to call React.useContext() in every component that needs that context value
export function useAuthState() {
	const context = React.useContext(AuthStateContext);
	if (context === undefined) {
		throw new Error("useAuthState must be used within a AuthProvider");
	}

	return context;
}

export function useAuthDispatch() {
	const context = React.useContext(AuthDispatchContext);
	if (context === undefined) {
		throw new Error("useAuthDispatch must be used within a AuthProvider");
	}

	return context;
}
