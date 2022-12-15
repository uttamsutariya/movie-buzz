import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";
import Date from "../../util/Date";

const initialState = {
	loading: true,
	error: "",
	hasNext: true,
	feedbacks: [],
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			return payload;

		case "FETCH_ERROR":
			return { ...state, error: payload };

		case "SET_LOADING":
			return { ...initialState, loading: payload };

		default:
			return state;
	}
};

const Feedback = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const location = useLocation();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);

	const { feedbacks, hasNext, loading, error } = state;

	const fetchFeedbacks = () => {
		dispatch({ type: "SET_LOADING", payload: true });
		axios
			.get(`/api/admin/feedback?page=${page}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: { ...res.data.data, loading: false, error: "" } });
			})
			.catch((error) => {
				if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
				dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
			});
	};

	useEffect(() => {
		fetchFeedbacks();
	}, [page]);

	const handleLoadMore = () => setPage((prev) => prev + 1);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar
				child={
					<>
						<h1 className={styles.nav_h1}>Feedbacks</h1>
					</>
				}
			/>

			<div className="m-5 bg-slate-800 p-10 rounded-md">
				<div className="flex flex-col items-center">
					<div className={styles.feedback_main}>
						{feedbacks.map((feedback) => (
							<div className={styles.feedback_card} key={feedback._id}>
								<h2 className={styles.card_email}>{feedback.user.email}</h2>
								<p className={styles.card_date}>
									on <Date date={feedback.createdAt} />
								</p>
								<p className={styles.card_message}>{feedback.message}</p>
							</div>
						))}
					</div>
					<button
						onClick={handleLoadMore}
						type="button"
						disabled={!hasNext}
						className={hasNext ? `${styles.load_more}` : `${styles.load_more_disabled}`}
					>
						Load older feedback
					</button>
				</div>
			</div>
		</div>
	);
};

const styles = {
	nav_h1: "text-2xl font-semibold",
	input: "block w-[20%] mb-5 p-3 text-sm text-gray-400 border border-gray-500 rounded-lg cursor-pointer bg-gray-800",
	feedback_main: "grid grid-cols-2 gap-3 md:grid-col-3 lg:grid-cols-4",
	feedback_card:
		"text-md font-extralight p-3 bg-mygray text-white flex flex-col justify-start items-start rounded-lg",
	card_email: "mt-1 text-sm",
	card_date: "text-xs text-blue-300",
	card_message: "mt-4 text-sm text-gray-400",
	load_more: "bg-blue-600 rounded-md font-medium my-6 px-6 py-2 text-white",
	load_more_disabled: "bg-blue-400 cursor-not-allowed  rounded-md font-medium my-6 px-6 py-2 text-white",
};

export default Feedback;
