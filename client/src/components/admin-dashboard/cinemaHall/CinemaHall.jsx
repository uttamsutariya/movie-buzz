import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// components
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import Navbar from "../Navigation/Navbar";
import Loader from "../../Loader";

const initialState = {
	loading: true,
	error: "",
	totalHalls: 0,
	cinemaHalls: [],
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

const CinemaHall = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { totalHalls, cinemaHalls, loading, error } = state;

	const fetchCinemaHalls = () => {
		axios
			.get(`/api/admin/cinemaHall`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
			})
			.catch(() => dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }));
	};

	useEffect(() => {
		fetchCinemaHalls();
	}, []);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar
				child={
					<>
						<h1 className={styles.nav_h1}>All CinemaHalls</h1>
						<Link to={"add"} className={styles.nav_link}>
							Add new cinemahall
						</Link>
					</>
				}
			/>

			{/* statistics */}
			<div className={styles.stat_main}>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Total Halls</h1>
					<p className={styles.stat_p}>{totalHalls}</p>
				</div>
			</div>

			{/* table */}

			<div className="mx-auto px-4 sm:px-8">
				<div className="py-2">
					<div className="py-4 overflow-x-auto">
						<div className={styles.table_container}>
							<table className="min-w-full">
								<thead className="sticky top-0 z-50">
									<tr>
										<th scope="col" className={styles.th}>
											<p>Sr.</p>
										</th>
										<th scope="col" className={styles.th}>
											<p className="cursor-pointer">
												Screen Name
												<SwapVertRoundedIcon fontSize="small" className="ml-2" />
											</p>
										</th>
										<th scope="col" className={styles.th}>
											<p className="cursor-pointer">
												Total Seats
												<SwapVertRoundedIcon fontSize="small" className="ml-2" />
											</p>
										</th>
										<th scope="col" className={styles.th}>
											<p className="cursor-pointer">
												Rows
												<SwapVertRoundedIcon fontSize="small" className="ml-2" />
											</p>
										</th>
										<th scope="col" className={styles.th}>
											<p className="cursor-pointer">
												Columns
												<SwapVertRoundedIcon fontSize="small" className="ml-2" />
											</p>
										</th>
									</tr>
								</thead>
								<tbody>
									{cinemaHalls.map((screen, index) => (
										<tr className={styles.tr} key={screen._id}>
											<td className={styles.td}>
												<p className={styles.td_p}>{index + 1}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{screen.screenName}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{screen.totalSeats}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{screen.totalRows}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{screen.totalColumns}</p>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
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

export default CinemaHall;
