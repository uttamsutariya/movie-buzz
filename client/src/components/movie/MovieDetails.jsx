import Navbar from "../Navbar";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import BackButton from "../BackButton";
import { useParams, Link } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";
import Loader from "../Loader";
import ArrayString from "../util/ArrayString";

const initialState = {
	loading: true,
	error: "",
	movie: {},
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			return { loading: false, error: "", movie: payload };
		case "FETCH_ERROR":
			return { ...state, error: payload };
		default:
			return state;
	}
};

const MovieDetails = () => {
	const { id } = useParams();

	const [state, dispatch] = useReducer(reducer, initialState);

	const { loading, error, movie } = state;

	const { _id, title, images, description, trailer_link, release_date, language, duration, genre, actors, status } =
		movie;

	useEffect(() => {
		axios
			.get(`/api/movies/${id}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.movie });
			})
			.catch(() => dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }));
	}, []);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const TABLE_FIELDS = [
		{
			key: "Title",
			value: title,
		},
		{
			key: "Release Date",
			value: release_date,
		},
		{
			key: "Language",
			value: <ArrayString arr={language} />,
		},
		{
			key: "Duration",
			value: duration,
		},
		{
			key: "Genres",
			value: <ArrayString arr={genre} />,
		},
		{
			key: "Cast",
			value: <ArrayString arr={actors} />,
		},
	];

	return (
		<>
			<Navbar />
			<div className="max-w-[1296px] m-auto">
				<div className={`${styles.movie_container} bg-slate-800`}>
					<BackButton />

					<h1 className={styles.movie_name}>{title}</h1>

					<div>
						<div className={styles.div1_container}>
							<div className="w-[65%]">
								<img className="rounded-lg" src={images.banner} alt={title} />
							</div>
							<div className={styles.details_container}>
								<div className="rounded-full">
									<h2 className={styles.about_movie}>
										<MovieFilterOutlinedIcon className="mr-4" fontSize="large" />
										About the movie
									</h2>
									<p className="text-gray-400">{description}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={`${styles.movie_container} bg-black flex justify-center items-center`}>
					<div className="flex flex-col items-center justify-between my-10 w-[80%]">
						<div className="flex justify-center items-center">
							<table>
								<tbody>
									{TABLE_FIELDS.map(({ key, value }, index) => (
										<tr className={styles.tr} key={index}>
											<td className={styles.table_fields}>{key}</td>
											<td className={styles.table_td}>{value}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<a href={trailer_link} target={"_blank"} className={styles.trailer_btn}>
							Watch Trailer
						</a>
						{status === "released" ? (
							<Link to={`/shows/${_id}`} className={styles.book_btn}>
								Book Your Show
							</Link>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
};

const styles = {
	movie_container: "p-5 rounded-lg my-3 relative",
	movie_name: "text-4xl font-semibold text-slate-400 text-center p-2",
	div1_container: "flex space-x-6 p-5",
	details_container: "w-[35%] flex flex-col justify-center",
	about_movie: "text-4xl mb-5 text-blue-400 font-semibold",
	tr: "text-gray-400",
	table_fields: "border-b-2 border-gray-600 p-3 text-white",
	table_td: "border-b-2 border-gray-600 p-3",
	trailer_btn: "bg-purple-600 w-[50%] text-center rounded mt-10 px-5 py-3 text-white",
	book_btn: "bg-blue-600 w-[50%] text-center rounded mt-5 px-5 py-3 text-white",
};

export default MovieDetails;
