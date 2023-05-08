import { createContext, useState } from "react";

export const MoviesContext = createContext([]);

export const MoviesProvider = ({ children }) => {
	const [movies, setMovies] = useState([]);

	return <MoviesContext.Provider value={{ movies, setMovies }}>{children}</MoviesContext.Provider>;
};
