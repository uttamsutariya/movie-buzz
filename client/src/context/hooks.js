import { useContext } from "react";
import { AuthDispatchContext, AuthStateContext } from "./AuthContext";
import { MoviesContext } from "./MoviesContext";

// custom hooks that will help in reading values from context objects without having to call React.useContext() in every component that needs context value
export const useAuthState = () => {
	const context = useContext(AuthStateContext);
	if (context === undefined) {
		throw new Error("useAuthState must be used within a AuthProvider");
	}

	return context;
};

export const useAuthDispatch = () => {
	const context = useContext(AuthDispatchContext);
	if (context === undefined) {
		throw new Error("useAuthDispatch must be used within a AuthProvider");
	}

	return context;
};

export const useMoviesContext = () => {
	const context = useContext(MoviesContext);

	return context;
};
