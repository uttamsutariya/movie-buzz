import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import SeatMap from "../util/SeatMap";
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import Swal from "sweetalert2";

import axios from "axios";

// toast
import { toast } from "react-toastify";

const initialState = {
	loading: true,
	error: "",
	availableSeats: [],
	bookedSeats: [],
	cinemaHall: {},
	price: 0,
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			const { availableSeats, bookedSeats, cinemaHall, price } = payload.show;
			return { ...state, loading: false, availableSeats, bookedSeats, cinemaHall, price };

		case "FETCH_ERROR":
			return { ...state, error: payload };

		default:
			return state;
	}
};

const SeatSelector = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [state, dispatch] = useReducer(reducer, initialState);
	const [multipleSeatConflict, setMultipleSeatConflict] = useState(false);

	const { loading, error, availableSeats, bookedSeats, cinemaHall, price } = state;

	const fetchSeats = () => {
		axios
			.get(`/api/shows/seats/${id}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
			})
			.catch((err) => {
				if (err.response.status == 403) navigate("/login", { state: { from: location } });
				dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchSeats();
	}, [multipleSeatConflict]);

	const [seats, setSeats] = useState([]);

	const handleSelectedSeats = (seatSet) => {
		setSeats([...seatSet]);
	};

	const handleSubmit = async (e) => {
		if (seats.length == 0) {
			Swal.fire({
				title: "Please select a seat",
				text: "You haven't selected any seat",
				icon: "warning",
				confirmButtonColor: "#2563eb",
			});
			return;
		}

		const formData = {
			show: id,
			seats,
		};

		Swal.fire({
			title: "Confirm your booking ?",
			text: "You won't be able to revert this!",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#2563eb",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, book it!",
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.post(`/api/user/bookShow`, formData)
					.then(() => {
						Swal.fire({
							title: "Seats are booked",
							text: "Congrats, your tickets are sent on your mail",
							icon: "success",
							confirmButtonColor: "#2563eb",
						});
						// toast.success("Your tickets are booked and sent on your mail 🤩");
						navigate("/movies");
					})
					.catch((error) => {
						if (error.response.status == 403) navigate("/login", { state: { from: location } });
						else {
							setMultipleSeatConflict(true);
							// toast.error(error?.response?.data?.message);
							Swal.fire({
								title: error?.response?.data?.message,
								text: "Something went wrong, sorry for inconvience !",
								icon: "error",
								confirmButtonColor: "#2563eb",
							});
						}
					});
			}
		});

		// const formData = {
		// 	show: id,
		// 	seats,
		// };

		// try {
		// 	await axios.post(`/api/user/bookShow`, formData);
		// 	toast.success("Your tickets are booked and sent on your mail 🤩");
		// 	navigate("/movies");
		// } catch (error) {
		// 	if (error.response.status == 403) navigate("/login", { state: { from: location } });
		// 	else {
		// 		setMultipleSeatConflict(true);
		// 		toast.error(error?.response?.data?.message);
		// 	}
		// }
	};

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="flex justify-center items-center">
			<div className={styles.main_container}>
				<BackButton />
				<p className={styles.price}>
					Price Per Ticket : <span className={styles.price_p}>{price} INR.</span>
				</p>

				<div className={styles.seat_map_container}>
					<div>
						<div className={styles.screen}>
							<p className={styles.screen_p}>Screen this side</p>
						</div>
					</div>
					<div className={styles.availability}>
						<div className={styles.avail_div}>
							<p className="text-sm">Booked </p>
							<input type="checkbox" checked={true} disabled />
						</div>
						<div className={styles.avail_div}>
							<p className="text-sm">Available </p>
							<input type="checkbox" checked={false} readOnly={true} />
						</div>
						<div className={styles.avail_div}>
							<p className="text-sm">Selected </p>
							<input type="checkbox" checked={true} readOnly />
						</div>
					</div>

					<SeatMap
						availableSeats={availableSeats}
						bookedSeats={bookedSeats}
						rows={cinemaHall?.totalRows}
						cols={cinemaHall?.totalColumns}
						handleSelectedSeats={handleSelectedSeats}
					/>
				</div>
				<div className="mt-5">
					<button onClick={handleSubmit} type="button" className={styles.submit_btn}>
						Pay {price * seats.length} INR.
					</button>
				</div>
			</div>
		</div>
	);
};

const styles = {
	main_container: "w-full md:w-[1100px] my-10 mx-auto p-10 bg-slate-800 relative flex flex-col items-center",
	price: "text-xl absolute top-12 left-5 text-blue-400",
	price_p: "text-white ml-2",
	seat_map_container: "w-full md:w-[50%] mt-14 m-auto flex flex-col justify-center items-center",
	screen: "h-[30px] w-[100%] bg-white mb-3 flex justify-center items-center",
	screen_p: "text-black font-bold px-10",
	selected_options_span: "ml-2 text-blue-400",
	availability: "my-3 flex justify-between",
	avail_div: "flex flex-col items-center justify-around mx-3",
	submit_btn: "bg-blue-600 w-[200px] rounded-md font-medium px-3 py-2 text-white",
};

export default SeatSelector;
