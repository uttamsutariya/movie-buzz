import { useEffect, useReducer } from "react";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { Link } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import Date from "../../util/Date";
import Time from "../../util/Time";

const initialState = {
	loading: true,
	error: "",
	totalShows: 0,
	todaysShows: 0,
	shows: [],
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

const Shows = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { shows, loading, error, totalShows, todaysShows } = state;

	const fetchShows = () => {
		axios
			.get(`/api/admin/shows`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
			})
			.catch(() => dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }));
	};

	useEffect(() => {
		fetchShows();
	}, []);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const showTable = (
		<table className="min-w-full">
			<thead className="sticky top-0 z-50">
				<tr>
					<th scope="col" className={styles.th}>
						<p>Sr.</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Date
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Time
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Movie
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p className="cursor-pointer">
							Total Bookings
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th scope="col" className={styles.th}>
						<p>Screen Name</p>
					</th>
					<th scope="col" className={styles.th}>
						Action
					</th>
				</tr>
			</thead>
			<tbody>
				{shows.map((show, index) => (
					<tr className={styles.tr} key={index}>
						<td className={styles.td}>
							<p className={styles.td_p}>{index + 1}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>
								<Date date={show.date} />
							</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>
								<Time date={show.startTime} />
							</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{show.movie}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{show.totalBookings}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{show.screen}</p>
						</td>
						<td className={styles.td}>
							<Link
								to={`${show._id}`}
								type="button"
								className="py-0.5 px-3 mx-1 bg-green-700 cursor-pointer text-white text-center font-medium rounded-md"
							>
								View Details
							</Link>
							{show.totalBookings !== 0 ? (
								<button
									type="button"
									className="py-0.5 px-3 mx-1 cursor-not-allowed bg-purple-400 text-white text-center font-medium rounded-md"
								>
									Update
								</button>
							) : (
								<Link
									to={`update/${show._id}`}
									type="button"
									className="py-0.5 px-3 mx-1 bg-purple-700 cursor-pointer text-white text-center font-medium rounded-md"
								>
									Update
								</Link>
							)}
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
						<h1 className={styles.nav_h1}>All Shows</h1>
						<Link to={"add"} className={styles.nav_link}>
							Add new show
						</Link>
					</>
				}
			/>

			{/* statistics */}
			<div className={styles.stat_main}>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Total Shows</h1>
					<p className={styles.stat_p}>{totalShows}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Today's Shows</h1>
					<p className={styles.stat_p}>{todaysShows}</p>
				</div>
			</div>

			<div className="mx-auto px-4 sm:px-8">
				<div className="py-2">
					<div className="py-4 overflow-x-auto">
						<div className={styles.table_container}>{showTable}</div>
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

export default Shows;
