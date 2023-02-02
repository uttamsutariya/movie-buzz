import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../Navbar";
import Ticket from "./Ticket";
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";

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
			.catch((error) => {
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
			<div className="w-full md:max-w-[1296px] my-2 mx-auto p-2 md:p-10 bg-slate-800 relative flex flex-col justify-center items-center">
				<BackButton />
				<div className="text-3xl text-white text-center mt-10 mb-3">My Bookings</div>
				<div className="flex justify-start items-center flex-wrap">
					{bookings?.length > 0 ? (
						bookings?.map((booking, index) => <Ticket booking={booking} key={booking._id} />)
					) : (
						<div className="my-10">
							<NoItem item={"You don't have any bookings yet!"} />
						</div>
					)}
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
