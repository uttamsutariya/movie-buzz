import { useReducer, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { Link } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import axios from "axios";
import Date from "../../util/Date";

const initialState = {
	loading: true,
	error: "",
	totalMovies: 0,
	releasedMovies: 0,
	comingSoonMovies: 0,
	movies: [],
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			return payload;

		case "FETCH_ERROR":
			return { ...state, error: payload };

		default:
			return state;
	}
};

const Movies = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const location = useLocation();
	const navigate = useNavigate();

	const { movies, totalMovies, releasedMovies, comingSoonMovies, loading, error } = state;

	const fetchMovies = () => {
		axios
			.get(`/api/admin/movies`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
			})
			.catch((error) => {
				if (error.response.status == 403) navigate("/login", { state: { from: location } });
				else dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	const deleteMovie = (e) => {
		const sure = window.confirm("Are you sure want to delete ?");

		if (sure) {
			axios
				.delete(`/api/admin/movies/${e.target.id}`)
				.then(() => {
					fetchMovies();
				})
				.catch((error) => {
					if (error.response.status == 403) navigate("/login", { state: { from: location } });
				});
		}
	};

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const movieTable = (
		<table className="min-w-full">
			<thead className="sticky top-0 z-50">
				<tr>
					<th scope="col" className={styles.th}>
						<p>Sr.</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Name
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Release Date
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Released
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						Action
					</th>
				</tr>
			</thead>
			<tbody>
				{movies.map((movie, index) => (
					<tr className={styles.tr} key={movie._id}>
						<td className={styles.td}>
							<p className={styles.td_p}>{index + 1}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{movie.title}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{<Date date={movie.release_date} />}</p>
						</td>
						<td className={styles.td}>
							<div className={styles.td_p}>
								{movie.status === "released" ? (
									<div className="inline-block py-0.5 px-3 mx-1 bg-green-400 text-black text-center font-medium rounded-full">
										yes
									</div>
								) : (
									<div className="inline-block py-0.5 px-3 mx-1 bg-orange-400 text-black text-center font-medium rounded-full">
										no
									</div>
								)}
							</div>
						</td>
						<td className={styles.td}>
							<button
								onClick={deleteMovie}
								id={movie._id}
								type="button"
								className="py-0.5 px-3 bg-red-700 text-white text-center font-medium rounded-md"
							>
								Delete
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar
				child={
					<>
						<h1 className={styles.nav_h1}>All Movies</h1>
						<Link to={"add"} className={styles.nav_link}>
							Add new movie
						</Link>
					</>
				}
			/>

			{/* statistics */}
			<div className={styles.stat_main}>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Total Movies</h1>
					<p className={styles.stat_p}>{totalMovies}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Released</h1>
					<p className={styles.stat_p}>{releasedMovies}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Coming Soon</h1>
					<p className={styles.stat_p}>{comingSoonMovies}</p>
				</div>
			</div>

			<div className="mx-auto px-4 sm:px-8">
				<div className="py-2">
					<div className="py-4 overflow-x-auto">
						<div className={styles.table_container}>{movies.length > 0 ? movieTable : null}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const styles = {
	th: "px-5 py-3 bg-black border-b border-gray-200 text-gray-200 text-left text-md font-light",
	td: "px-5 py-4 border-b border-gray-500 text-sm",
	tr: "bg-gray-300 hover:bg-gray-100",
	td_p: "text-black whitespace-no-wrap",
	nav_h1: "text-2xl font-semibold",
	nav_link: "py-1 px-4 bg-blue-600 text-white text-center font-medium rounded-md",
	stat_main: "mx-5 my-1 flex  justify-start items-center",
	stat_h1: "text-3xl font-extrabold mb-2",
	stat_p: "text-blue-400 text-3xl font-semibold",
	table_container: "inline-block min-w-full rounded-lg max-h-[70vh] overflow-auto scroll-smooth",
};

export default Movies;
