import { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// components
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";

// toast
import { toast } from "react-toastify";

const initialState = {
	loading: true,
	error: "",
	movies: [],
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

const ShowForm = ({ update }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [isSubmitting, setIsSubmitting] = useState("");

	const { movies, cinemaHalls, loading, error } = state;

	const fetchDetails = async () => {
		try {
			const { data: movieData } = await axios.get(`/api/admin/released-movies`);
			const { data: hallData } = await axios.get(`/api/admin/cinemaHall`);

			dispatch({
				type: "FETCH_SUCCESS",
				payload: {
					movies: movieData.data.movies,
					cinemaHalls: hallData.data.cinemaHalls,
					loading: false,
					error: "",
				},
			});
		} catch (error) {
			if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
			else dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
		}
	};

	useEffect(() => {
		fetchDetails();
	}, []);

	let defaultFormData = {
		movie: "",
		cinemaHall: "",
		price: 0,
		dateTime: "",
	};

	if (update) {
		useEffect(() => {
			axios
				.get(`/api/admin/shows/populate/${id}`)
				.then((res) => {
					const data = res.data.data.show;
					setFormData((prev) => ({ ...prev, ...data, dateTime: data.date }));
				})
				.catch((error) => {
					if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
					dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
				});
		}, []);
	}

	const [formData, setFormData] = useState(defaultFormData);

	let { movie, cinemaHall, price, dateTime } = formData;

	const formateDate = (dateTime) => {
		const date = new Date(dateTime);

		const checkLessThan10 = (val) => {
			if (val < 10) {
				return "0" + val;
			}
			return val;
		};

		return (
			date.getFullYear() +
			"-" +
			checkLessThan10(Number(date.getMonth() + 1)) +
			"-" +
			checkLessThan10(date.getDate()) +
			"T" +
			checkLessThan10(date.getHours()) +
			":" +
			checkLessThan10(date.getMinutes())
		);
	};

	dateTime = formateDate(dateTime);

	const handleSubmit = (e) => {
		e.preventDefault();

		const { movie, cinemaHall, price, dateTime } = formData;

		if (!movie || !cinemaHall || !price || !dateTime) {
			toast.error("Please select all fields");
			return;
		}

		if (update) {
			setIsSubmitting("Updating show ...");
			axios
				.patch(`/api/admin/show/${id}`, formData)
				.then((res) => {
					toast.success("Show updated");
					setIsSubmitting("");
					navigate(-1);
				})
				.catch((error) => {
					if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
					else toast.error(error?.response?.data?.message);
				});
		} else {
			setIsSubmitting("Adding new show ...");
			axios
				.post(`/api/admin/show`, formData)
				.then((res) => {
					toast.success("Show added succesfully");
					setIsSubmitting("");
					navigate(-1);
				})
				.catch((error) => {
					if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
					else toast.error(error?.response?.data?.message);
				});
		}
	};

	const handleChange = (e) => {
		setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
	};

	if (error) return <Loader msg="err" />;
	if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar
				child={
					<>
						{update ? (
							<h1 className={styles.nav_h1}>Update show details</h1>
						) : (
							<h1 className={styles.nav_h1}>Add New Show</h1>
						)}
					</>
				}
			/>

			<div className="m-5 p-5 bg-slate-800 rounded-lg">
				<form className="w-[60%] m-auto" autoComplete="off">
					{/* Movie */}
					<div className="mb-6">
						<label htmlFor="lang" className={styles.label}>
							Movie
						</label>
						<select name="movie" onChange={handleChange} id="lang" className={`${styles.input} p-2`}>
							{update ? (
								<option defaultValue={movie._id}>{movie.title}</option>
							) : (
								<option value="">Select Movie</option>
							)}
							{movies.map((movie) => (
								<option value={movie._id} key={movie._id}>
									{movie.title}
								</option>
							))}
						</select>
					</div>

					{/* cinema hall */}
					<div className="mb-6">
						<label htmlFor="lang" className={styles.label}>
							Cinema Hall
						</label>
						<select name="cinemaHall" onChange={handleChange} id="lang" className={`${styles.input} p-2`}>
							{update ? (
								<option defaultValue={cinemaHall._id}>{cinemaHall.screenName}</option>
							) : (
								<option value="">Select Movie</option>
							)}
							{cinemaHalls.map((hall) => (
								<option value={hall._id} key={hall._id}>
									{hall.screenName}
								</option>
							))}
						</select>
					</div>

					<div className="mb-6 flex justify-start space-x-20">
						{/* Price */}
						<div className="w-[50%]">
							<label className={styles.label} htmlFor="title">
								Price
							</label>
							<input
								onChange={handleChange}
								value={price}
								id="title"
								type="number"
								name="price"
								className={`${styles.input} px-3 py-2 w-[100%]`}
								placeholder="Show price"
								required
							/>
						</div>

						{/* Date & time */}
						<div className="w-[50%]">
							<label className={styles.label} htmlFor="release-date">
								Show Date & Time
							</label>
							<input
								onChange={handleChange}
								value={dateTime}
								min={new Date().toISOString()}
								id="release-date"
								type="datetime-local"
								name="dateTime"
								className={`${styles.input} w-[100%] px-3 py-2`}
								required
							/>
						</div>
					</div>
					<button
						disabled={isSubmitting}
						onClick={handleSubmit}
						type="button"
						className={isSubmitting ? `${styles.btn_disabled}` : `${styles.btn}`}
					>
						{update ? (
							<>
								<DesignServicesOutlinedIcon /> {isSubmitting ? isSubmitting : "Update show details"}
							</>
						) : (
							<>
								<FileUploadOutlinedIcon /> {isSubmitting ? isSubmitting : "Add new show"}
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

const styles = {
	nav_h1: "text-2xl font-semibold text-blue-400",
	input: "block w-full mb-5 text-sm text-gray-400 border border-gray-500 rounded-lg cursor-pointer bg-gray-800",
	label: "block mb-2 font-extralight text-blue-400",
	btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-md rounded hover:bg-blue-700",
	btn_disabled: "w-full px-6 py-2.5 bg-blue-400 cursor-not-allowed text-white font-medium text-md rounded",
};

export default ShowForm;
