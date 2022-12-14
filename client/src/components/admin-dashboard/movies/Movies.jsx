import { useReducer, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { Link } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import axios from "axios";
import Date from "../../util/Date";
import TablePagination from "@mui/material/TablePagination";

import { SORT_OPTION } from "../../../../constants";
import { toast } from "react-toastify";

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

	const [sortOption, setSortOption] = useState(SORT_OPTION.TITLE);
	const [sortOrder, setSortOrder] = useState(1);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleSortOptionChange = (sortOption) => {
		sortOrder == 1 ? setSortOrder(-1) : setSortOrder(1);
		setSortOption(sortOption);
	};

	const handleChangePage = (e, newPage) => setPage(newPage);

	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	const { movies, totalMovies, releasedMovies, comingSoonMovies, loading, error } = state;

	const fetchMovies = () => {
		axios
			.get(`/api/admin/movies?sortBy=${sortOption}&order=${sortOrder}&page=${page}&perPage=${rowsPerPage}`)
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
	}, [sortOption, sortOrder, page, rowsPerPage]);

	const deleteMovie = (e) => {
		const sure = window.confirm("Are you sure want to delete ?");

		if (sure) {
			axios
				.delete(`/api/admin/movies/${e.target.id}`)
				.then(() => {
					toast.success("Deleted succesfully");
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
					<th className={styles.th}>
						<p>Sr.</p>
					</th>
					<th
						onClick={() => handleSortOptionChange(SORT_OPTION.TITLE)}
						className={`${styles.th} cursor-pointer`}
					>
						<p>
							Name
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th
						onClick={() => handleSortOptionChange(SORT_OPTION.RELEASE_DATE)}
						className={`${styles.th} cursor-pointer`}
					>
						<p>
							Release Date
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th className={styles.th}>
						<p>Released</p>
					</th>
					<th className={styles.th}>Action</th>
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
				<tr className="bg-gray-300">
					<td colSpan={5} className="px-24">
						<TablePagination
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							component="div"
							count={totalMovies}
							page={page}
							rowsPerPage={rowsPerPage}
							rowsPerPageOptions={[5, 10, 25, 50, 100]}
							sx={{
								backgroundColor: "#d1d5db",
							}}
							labelRowsPerPage={<>Rows per page</>}
							labelDisplayedRows={({ from, to, count }) => (
								<>
									{from} - {to} of {count != -1 ? count : `more than ${to}`}
								</>
							)}
						/>
					</td>
				</tr>
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
				<div className="overflow-x-auto">
					<div className={styles.table_container}>{movies.length > 0 ? movieTable : null}</div>
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
	table_container: "inline-block min-w-full rounded-lg overflow-auto scroll-smooth",
};

export default Movies;
