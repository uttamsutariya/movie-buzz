import { loginUser, logout, signupUser } from "./actions";
import { AuthProvider } from "./AuthContext";
import { useAuthDispatch, useAuthState } from "./hooks";
import { MoviesProvider } from "./MoviesContext";

export { AuthProvider, useAuthState, useAuthDispatch, loginUser, logout, signupUser, MoviesProvider };
