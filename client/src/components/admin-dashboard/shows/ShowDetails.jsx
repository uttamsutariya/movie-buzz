import { useEffect, useReducer } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import Date from "../../util/Date";
import ArrayString from "../../util/ArrayString";

const initialState = {
	loading: true,
	error: "",
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

	const { loading, error, totalSeats, bookedSeats, availableSeats, price, bookings, totalEarningns } = state;

	const fetchShowDetails = () => {
		axios
			.get(`/api/admin/shows/${id}`)
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
	}, []);

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
									<th scope="col" className={styles.th}>
										<p>Sr.</p>
									</th>
									<th scope="col" className={styles.th}>
										<p className="cursor-pointer">
											Email
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</p>
									</th>
									<th scope="col" className={styles.th}>
										<p className="cursor-pointer">
											Booking ID
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</p>
									</th>
									<th scope="col" className={styles.th}>
										<p className="cursor-pointer">
											Seats
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</p>
									</th>
									<th scope="col" className={styles.th}>
										<p className="cursor-pointer">
											Booking Date
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</p>
									</th>
									<th scope="col" className={styles.th}>
										<p>
											Amount Paid
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</p>
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
											<p className={styles.td_p}>{booking.totalAmount} INR.</p>
										</td>
									</tr>
								))}
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
	table_container: "inline-block min-w-full rounded-lg max-h-[70vh] overflow-auto scroll-smooth",
};

export default ShowDetails;
