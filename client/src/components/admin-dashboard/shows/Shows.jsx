import { useEffect, useReducer, useState } from "react";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import Date from "../../util/Date";
import Time from "../../util/Time";
import TablePagination from "@mui/material/TablePagination";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NoItem from "../../util/NoItem";
import LoadingButton from "@mui/lab/LoadingButton";

import { SORT_OPTION } from "../../../../constants";

const initialState = {
	loading: true,
	error: "",
	totalShows: 0,
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
	const location = useLocation();
	const navigate = useNavigate();

	const [sortOption, setSortOption] = useState(SORT_OPTION.DATE);
	const [sortOrder, setSortOrder] = useState(1);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [tableLoading, setTableLoading] = useState(false);

	const handleSortOptionChange = (sortOption) => {
		sortOrder == 1 ? setSortOrder(-1) : setSortOrder(1);
		setSortOption(sortOption);
	};

	const handleChangePage = (e, newPage) => setPage(newPage);

	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	const { shows, loading, error, totalShows, todaysShows } = state;

	const fetchShows = () => {
		setTableLoading(true);
		axios
			.get(
				`/api/admin/shows/scheduled?sortBy=${sortOption}&order=${sortOrder}&page=${page}&perPage=${rowsPerPage}`
			)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
				setTableLoading(false);
			})
			.catch((error) => {
				if (error.response.status == 403) navigate("/login", { state: { from: location } });
				else dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchShows();
	}, [sortOption, sortOrder, page, rowsPerPage]);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const showTable = (
		<table className="min-w-full">
			<thead>
				<tr>
					<th className={styles.th}>
						<p>Sr.</p>
					</th>
					<th
						onClick={() => handleSortOptionChange(SORT_OPTION.DATE)}
						className={`${styles.th} cursor-pointer`}
					>
						<p>
							Date
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th className={styles.th}>
						<p>Time</p>
					</th>
					<th
						onClick={() => handleSortOptionChange(SORT_OPTION.MOVIE_NAME)}
						className={`${styles.th} cursor-pointer`}
					>
						<p>
							Movie
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>
					<th
						onClick={() => handleSortOptionChange(SORT_OPTION.TOTAL_BOOKINGS)}
						className={`${styles.th} cursor-pointer`}
					>
						<p>
							Total Bookings
							<SwapVertRoundedIcon fontSize="small" className="ml-2" />
						</p>
					</th>

					<th className={styles.th}>
						<p>Screen Name</p>
					</th>
					<th className={styles.th}>Action</th>
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
							<p className={styles.td_p}>{show?.movie?.title}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{show?.totalBookings}</p>
						</td>
						<td className={styles.td}>
							<p className={styles.td_p}>{show?.cinemaHall?.screenName}</p>
						</td>
						<td className={styles.td}>
							<Link
								to={`${show._id}`}
								title="view details"
								type="button"
								className={styles.view_details_btn}
							>
								<VisibilityOutlinedIcon />
							</Link>

							<button
								onClick={() => navigate(`update/${show._id}`)}
								disabled={show.totalBookings !== 0}
								type="button"
								className={
									show.totalBookings !== 0 ? `${styles.update_disabled_btn}` : `${styles.update_btn}`
								}
								title={
									show.totalBookings !== 0
										? "can't update show for more than one booking"
										: "update show"
								}
							>
								<EditOutlinedIcon />
							</button>
						</td>
					</tr>
				))}
				<tr className="bg-gray-300">
					<td colSpan={6}>
						<TablePagination
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							component="div"
							count={totalShows}
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
					<td className="">
						<LoadingButton loading={tableLoading} />
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
						<h1 className={styles.nav_h1}>All Shows</h1>
						<div className="flex space-x-4">
							<Link to={"add"} className={`${styles.nav_link} bg-blue-600`}>
								Add new show
							</Link>
							<Link to={"history"} className={`${styles.nav_link} bg-purple-600`}>
								view history
							</Link>
						</div>
					</>
				}
			/>

			{/* statistics */}
			<div className={styles.stat_main}>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Total scheduled shows</h1>
					<p className={styles.stat_p}>{totalShows}</p>
				</div>
			</div>

			<div className="mx-auto px-4 sm:px-8">
				<div className="overflow-x-auto">
					<div className={styles.table_container}>
						{shows.length > 0 ? showTable : <NoItem item={"We don't have any running shows, add one !"} />}
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
	nav_link: "py-1 px-4 text-white text-center font-medium rounded-md",
	stat_main: "mx-5 my-1 flex  justify-start items-center",
	stat_h1: "text-3xl font-extrabold mb-2",
	stat_p: "text-blue-400 text-3xl font-semibold",
	table_container: "inline-block min-w-full rounded-lg overflow-auto scroll-smooth",
	view_details_btn: "p-0.5 mx-1 bg-orange-600 cursor-pointer text-white text-center font-medium rounded-md",
	update_disabled_btn: "p-0.5 mx-1 cursor-not-allowed bg-purple-400 text-white text-center font-medium rounded-md",
	update_btn: "p-0.5 mx-1 bg-purple-700 cursor-pointer text-white text-center font-medium rounded-md",
};

export default Shows;
