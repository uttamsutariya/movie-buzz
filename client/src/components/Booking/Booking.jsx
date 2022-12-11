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

	return (
		<>
			<Navbar />
			<div className="max-w-[1296px] my-2 mx-auto w-full p-10 bg-slate-800 rounded-2xl relative">
				<BackButton />
				<div className="text-4xl text-white text-center mb-3">My Bookings</div>
				<div className="flex justify-center items-center flex-wrap">
					{bookings?.map((booking, index) => (
						<Ticket booking={booking} key={booking._id} />
					))}
				</div>
			</div>
		</>
	);
};

export default Booking;
