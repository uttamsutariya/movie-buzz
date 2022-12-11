import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../Navbar";
import Ticket from "./Ticket";
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";

const initialState = {
	loading: true,
	error: null,
	bookings: [],
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			return { loading: false, error: "", bookings: payload };
		case "FETCH_ERROR":
			return { ...state, error: payload };
		default:
			return state;
	}
};

const Booking = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const location = useLocation();
	const navigate = useNavigate();

	const { loading, error, bookings } = state;

	const fetchBookings = async () => {
		axios
			.get(`/api/user/bookings`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.bookings });
			})
			.catch(() => {
				if (error.response.status == 403) navigate("/login", { state: { from: location } });
				dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const noBookings = (
		<div className={styles.nobooking}>
			<p className={styles.nobookings_p}>
				<span className="text-3xl md:text-5xl">❌ You don't have any bookings yet ❌</span>
			</p>
		</div>
	);

	return (
		<>
			<Navbar />
			<div className="w-full h-[75vh] md:max-w-[1296px] my-2 mx-auto p-2 md:p-10 bg-slate-800 relative">
				<BackButton />
				<div className="text-3xl text-white text-center mt-10 mb-3">My Bookings</div>
				<div className="flex justify-start items-center flex-wrap">
					{bookings?.length > 0
						? bookings?.map((booking, index) => <Ticket booking={booking} key={booking._id} />)
						: noBookings}
				</div>
			</div>
		</>
	);
};

const styles = {
	nobooking: "max-w-[1296px] w-[100vw] relative flex justify-center items-center m-auto",
	nobookings_p: "text-center font-extrabold text-gray-400 mt-48",
};

export default Booking;
