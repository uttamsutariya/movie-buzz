import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// components
import Navbar from "../Navbar";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import BackButton from "../util/BackButton";
import Date from "../util/Date";
import Loader from "../util/Loader";
import ArrayString from "../util/ArrayString";
import { useMoviesContext } from "../../context/hooks";

const MovieDetails = () => {
	const { id } = useParams();

	const { movies } = useMoviesContext();
	const [movie, setMovie] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { _id, title, images, description, trailer_link, release_date, language, duration, genre, actors, status } =
		movie;

	function findMovie(movieId) {
		return movies.find((movie) => movie._id == movieId);
	}

	useEffect(() => {
		setLoading(true);
		const foundMovie = findMovie(id);
		if (!foundMovie) {
			setError("Something went wrong");
		} else {
			setMovie(foundMovie);
		}
		setLoading(false);
	}, [id]);

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	const TABLE_FIELDS = [
		{
			key: "Title",
			value: title,
		},
		{
			key: "Release Date",
			value: <Date date={release_date} />,
		},
		{
			key: "Language",
			value: <ArrayString arr={language} />,
		},
		{
			key: "Duration",
			value: `${parseInt(duration / 60)}h, ${parseInt(duration % 60)}m`,
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
			<div className={styles.main}>
				<div className={`${styles.movie_container} bg-slate-800`}>
					<BackButton />

					<h1 className={styles.movie_name}>{title}</h1>

					<div className={styles.img_container}>
						<img className={styles.img} src={images?.banner} alt={title} />
					</div>
					<div className={styles.main_details_container}>
						<div className={styles.details_container}>
							<div>
								<h2 className={styles.about_movie}>
									<MovieFilterOutlinedIcon className="mr-4" fontSize="large" />
									About the movie
								</h2>
								<p className="text-gray-400">{description}</p>
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
						<div className={styles.table_container}>
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
					</div>
				</div>
			</div>
		</>
	);
};

const styles = {
	main: "max-w-[1296px] m-auto",
	movie_container: "p-0.5 md:p-5 my-3 relative",
	movie_name: "text-4xl font-semibold text-slate-400 text-center p-2 mt-10 md:mt-5",
	img_container: "flex justify-center w-full m-auto p-2 md:p-5",
	img: "rounded-lg w-[100%] md:w-[70%] h-auto",
	main_details_container:
		"flex flex-col md:flex-row items-start md:items-start justify-center md:space-x-10 my-10 p-2 md:p-5",
	details_container: "flex flex-col justify-center w-full md:w-[50%]",
	table_container: "flex justify-center items-center my-10 md:my-0 w-full md:w-auto",
	about_movie: "text-4xl mb-5 text-blue-400 font-semibold",
	tr: "text-gray-400",
	table_fields: "border-b-2 border-gray-600 p-3 text-white",
	table_td: "border-b-2 border-gray-600 p-3",
	trailer_btn: "bg-purple-600 w-full text-center rounded mt-10 px-5 py-3 text-white",
	book_btn: "bg-blue-600 w-full text-center rounded mt-5 px-5 py-3 text-white",
};

export default MovieDetails;
