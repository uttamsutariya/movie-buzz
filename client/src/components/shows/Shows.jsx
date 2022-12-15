import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";

// conponents
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import Navbar from "../Navbar";
import Time from "../util/Time";
import Date from "../util/Date";

import { SORT_OPTION } from "../../../constants";

const initialState = {
	loading: true,
	error: "",
	movie: "",
	shows: [],
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			const { movie, shows } = payload;
			return { loading: false, error: "", movie, shows };
		case "FETCH_ERROR":
			return { ...state, error: payload };
		default:
			return state;
	}
};

const Shows = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [radioValue, setRadioValue] = useState("");

	const [state, dispatch] = useReducer(reducer, initialState);

	const [sortOption, setSortOption] = useState(SORT_OPTION.DATE);

	const [sortOrder, setSortOrder] = useState(1);

	const { loading, error, shows, movie } = state;

	useEffect(() => {
		axios
			.get(`/api/shows/${id}?sortBy=${sortOption}&order=${sortOrder}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
			})
			.catch((error) => dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }));
	}, [sortOption, sortOrder]);

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate(`/shows/seat-map/${radioValue}`);
	};

	const handleRadioOnChange = (e) => {
		setRadioValue(e.target.value);
	};

	const handleSortOptionChange = (sortOption) => {
		sortOrder == 1 ? setSortOrder(-1) : setSortOrder(1);
		setSortOption(sortOption);
	};

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const show = (
		<div className={styles.main}>
			<BackButton />
			<div className="text-3xl text-white text-center mt-8">{movie}</div>
			<div className="mx-auto md:max-w-3xl">
				<form onSubmit={handleSubmit}>
					<div className="py-4 overflow-x-auto">
						<div className={styles.table_container}>
							<table className="min-w-full">
								<thead>
									<tr>
										<th className={styles.th}></th>
										<th
											onClick={() => handleSortOptionChange(SORT_OPTION.DATE)}
											className={`${styles.th} cursor-pointer`}
										>
											Date
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</th>
										<th className={styles.th}>Time</th>
										<th
											onClick={() => handleSortOptionChange(SORT_OPTION.PRICE)}
											className={`${styles.th} cursor-pointer`}
										>
											Price
											<SwapVertRoundedIcon fontSize="small" className="ml-2" />
										</th>
										<th className={styles.th}>Cinema Hall</th>
									</tr>
								</thead>
								<tbody>
									{shows?.map((show, index) => (
										<tr className={styles.tr} key={index}>
											<td className={styles.td}>
												<input
													type="radio"
													name="show"
													radioGroup="show"
													value={show._id}
													className="w-[100%]"
													required
													onChange={handleRadioOnChange}
													checked={radioValue == `${show._id}`}
												/>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{<Date date={show.date} />}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{<Time date={show.startTime} />}</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{show.price} INR</p>
											</td>
											<td className={styles.td}>
												<p className={styles.td_p}>{show.cinemaHall.screenName}</p>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<button type="submit" className="bg-blue-600 w-full rounded-md font-medium my-6 p-2 text-white">
						Select Seats
					</button>
				</form>
			</div>
		</div>
	);

	const noShow = (
		<div className={styles.noshow}>
			<BackButton />
			<p className={styles.noshow_p}>
				<span className="text-3xl md:text-5xl">❌ No available shows ❌</span>
			</p>
		</div>
	);

	return (
		<div>
			<Navbar />
			{shows.length > 0 ? show : noShow}
		</div>
	);
};

const styles = {
	main: "max-w-[1296px] my-2 mx-auto w-full p-2 md:p-10 bg-slate-800 relative",
	th: "px-2 md:px-5 py-2 md:py-3 bg-black text-gray-200 text-left text-sm md:text-md font-light",
	td: "px-2 md:px-5 py-2 md:py-3 border-b border-gray-500 text-sm",
	tr: "bg-gray-300 hover:bg-gray-100",
	td_p: "text-black whitespace-no-wrap",
	table_container: "inline-block min-w-full rounded-lg max-h-[70vh] overflow-auto scroll-smooth",
	noshow: "max-w-[1296px] w-[100vw] relative flex justify-center items-center m-auto",
	noshow_p: "text-center font-extrabold text-gray-400 mt-48",
};

export default Shows;
