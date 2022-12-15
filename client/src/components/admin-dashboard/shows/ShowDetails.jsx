import { useEffect, useReducer, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import Date from "../../util/Date";
import Time from "../../util/Time";
import ArrayString from "../../util/ArrayString";
import TablePagination from "@mui/material/TablePagination";

const initialState = {
	loading: true,
	error: "",
	totalBookings: 0,
	totalSeats: 0,
	bookedSeats: 0,
	availableSeats: 0,
	price: 0,
	totalEarningns: 0,
	bookings: [],
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

const ShowDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [state, dispatch] = useReducer(reducer, initialState);

	const { loading, error, totalBookings, totalSeats, bookedSeats, availableSeats, price, bookings, totalEarningns } =
		state;

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

	const fetchShowDetails = () => {
		axios
			.get(`/api/admin/shows/${id}?page=${page}&perPage=${rowsPerPage}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
			})
			.catch((error) => {
				if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
				dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchShowDetails();
	}, [page, rowsPerPage]);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const bookingTable = (
		<div className="mx-auto px-4 sm:px-8">
			<div className="py-2">
				<div className="py-4 overflow-x-auto">
					<div className={styles.table_container}>
						<table className="min-w-full">
							<thead className="sticky top-0 z-50">
								<tr>
									<th className={styles.th}>
										<p>Sr.</p>
									</th>
									<th className={styles.th}>
										<p>Email</p>
									</th>
									<th className={styles.th}>
										<p>Booking ID</p>
									</th>
									<th className={styles.th}>
										<p>Seats</p>
									</th>
									<th
										onClick={() => handleSortOptionChange(SORT_OPTION.BOOKING_DATE)}
										className={styles.th}
									>
										<p>Booking Date</p>
									</th>
									<th
										onClick={() => handleSortOptionChange(SORT_OPTION.BOOKING_DATE)}
										className={styles.th}
									>
										<p>Time</p>
									</th>
									<th
										onClick={() => handleSortOptionChange(SORT_OPTION.AMOUNT_PAID)}
										className={styles.th}
									>
										<p>Amount Paid</p>
									</th>
								</tr>
							</thead>
							<tbody>
								{bookings.map((booking, index) => (
									<tr className={styles.tr} key={index}>
										<td className={styles.td}>
											<p className={styles.td_p}>{index + 1}</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>{booking.user.email}</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>{booking.bookingId}</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>
												<ArrayString arr={booking.seats} />
											</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>
												<Date date={booking.createdAt} />
											</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>
												<Time date={booking.createdAt} />
											</p>
										</td>
										<td className={styles.td}>
											<p className={styles.td_p}>{booking.totalAmount} INR.</p>
										</td>
									</tr>
								))}
								<tr className="bg-gray-300">
									<td colSpan={7} className="px-24">
										<TablePagination
											onPageChange={handleChangePage}
											onRowsPerPageChange={handleChangeRowsPerPage}
											component="div"
											count={totalBookings}
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
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar child={<h1 className={styles.nav_h1}>Booking History</h1>} />

			{/* statistics */}
			<div className={styles.stat_main}>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Total Seats</h1>
					<p className={styles.stat_p}>{totalSeats}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Booked</h1>
					<p className={styles.stat_p}>{bookedSeats}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Available</h1>
					<p className={styles.stat_p}>{availableSeats}</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Price</h1>
					<p className={styles.stat_p}>{price} INR.</p>
				</div>
				<div className="m-5">
					<h1 className={styles.stat_h1}>Earnings</h1>
					<p className={styles.stat_p}>{totalEarningns} INR.</p>
				</div>
			</div>

			{bookings.length == 0 ? null : bookingTable}
		</div>
	);
};

const styles = {
	th: "px-5 py-3 bg-black border-b border-gray-200 text-gray-200 text-left text-md font-light",
	td: "px-5 py-4 border-b border-gray-500 text-sm",
	tr: "bg-gray-300 hover:bg-gray-100",
	td_p: "text-black whitespace-no-wrap",
	nav_h1: "text-2xl font-semibold",
	stat_main: "mx-5 my-1 flex  justify-start items-center",
	stat_h1: "text-3xl font-extrabold mb-2",
	stat_p: "text-blue-400 text-3xl font-semibold",
	table_container: "inline-block min-w-full rounded-lg overflow-auto scroll-smooth",
};

export default ShowDetails;
