import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";

// toast
import { toast } from "react-toastify";

import { movieGenres, languages } from "../../../../constants";
import { useMoviesContext } from "../../../context/hooks";

const MovieForm = () => {
	const defaultFormData = {
		title: "",
		description: "",
		actors: "",
		trailer_link: "",
		poster: null,
		banner: null,
		release_date: "",
		duration: "",
		language: [],
		genre: [],
		adult: false,
	};

	const { setMovies } = useMoviesContext();
	const [formData, setFormData] = useState(defaultFormData);
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState("");

	const validateInput = (values) => {
		const { title, description, actors, trailer_link, poster, banner, release_date, duration, language, genre } =
			values;

		const errors = {};

		if (!title) errors.title = "Title is required";
		if (!description) errors.description = "Description is required";
		if (!actors) errors.actors = "Cast is required";
		if (!trailer_link) errors.trailer_link = "Trailer link is required";
		if (!poster) errors.poster = "Poster is required";
		if (!banner) errors.banner = "Banner is required";
		if (!release_date) errors.release_date = "Release date is required";
		if (!duration) errors.duration = "Movie duration is required";
		if (language.length == 0) errors.language = "Please select languages";
		if (genre.length == 0) errors.genre = "Please select genres";

		setFormErrors(errors);
		if (Object.keys(errors).length > 0) return true;
		return false;
	};

	const handleChange = (e) => {
		const { target } = e;

		const name = target.name;
		const value = target.type == "checkbox" ? target.checked : target.value;

		if (target.type == "file") {
			setFormData({ ...formData, [e.target.name]: e.target.files[0] });
		} else if (target.type == "select-multiple") {
			const vals = [];

			let options = new Array(...target.options);

			for (let opt of options) {
				if (opt.selected) vals.push(opt.value);
			}

			setFormData({ ...formData, [e.target.name]: vals });
		} else setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let uploadData = new FormData();

		if (validateInput(formData)) return;

		for (let key in formData) {
			if (key == "poster" || key == "banner") uploadData.set(key, formData[key], formData[key].name);
			else uploadData.set(key, formData[key]);
		}

		setIsSubmitting("Adding new movie ...");

		try {
			const res = await axios.post("/api/admin/movies", uploadData);
			setMovies(res.data.data.movie);
			setLoading(false);
			navigate(-1);
			toast.success("Movie added successfully");
		} catch (error) {
			if (error?.response?.status == 403) navigate("/login", { state: { from: location } });
			else toast.error(error?.response?.data?.message);
			setLoading(false);
		}
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar child={<h1 className={styles.nav_h1}>Add New Movie</h1>} />

			<div className="m-5 p-5 bg-slate-800 rounded-lg">
				<form
					onSubmit={handleSubmit}
					className="w-[60%] m-auto"
					autoComplete="off"
					encType="multipart/form-data"
				>
					{/* movie title */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="title">
							Title *
						</label>
						<input
							onChange={handleChange}
							id="title"
							name="title"
							type="text"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Movie title"
						/>
						<p className={`${styles.error}`}>{formErrors.title}</p>
					</div>

					{/* movie description */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="desc">
							Description *
						</label>
						<textarea
							onChange={handleChange}
							id="desc"
							name="description"
							className={`${styles.input} px-3 py-2 w-[100%] resize-none`}
							rows={1}
							placeholder="Enter Movie Description"
						/>
						<p className={`${styles.error}`}>{formErrors.description}</p>
					</div>

					{/* actors */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="cast">
							Actors (cast) *
						</label>
						<input
							onChange={handleChange}
							id="cast"
							type="text"
							name="actors"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Enter comma separated values"
						/>
						<p className={`${styles.error}`}>{formErrors.actors}</p>
					</div>

					{/* trailer link */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="trailer">
							Trailer Link *
						</label>
						<input
							onChange={handleChange}
							id="trailer"
							type="text"
							name="trailer_link"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Enter youtube trailer link"
						/>
						<p className={`${styles.error}`}>{formErrors.trailer_link}</p>
					</div>

					{/* image upload */}
					<div className="mb-6 flex justify-between">
						{/* poster image  */}
						<div>
							<label className={styles.label} htmlFor="poster">
								Poster Image *
							</label>
							<input
								onChange={handleChange}
								className={styles.input}
								id="poster"
								type="file"
								name="poster"
							/>
							<p className={`${styles.error}`}>{formErrors.poster}</p>
						</div>
						{/* banner image */}
						<div>
							<label className={styles.label} htmlFor="banner">
								Banner Image *
							</label>
							<input
								onChange={handleChange}
								className={styles.input}
								id="banner"
								type="file"
								name="banner"
							/>
							<p className={`${styles.error}`}>{formErrors.banner}</p>
						</div>
					</div>

					<div className="mb-6 flex justify-start space-x-20">
						{/* date & duration */}
						<div className="w-[40%]">
							<div>
								<label className={styles.label} htmlFor="release-date">
									Release Date *
								</label>
								<input
									onChange={handleChange}
									className={`${styles.input} px-3 py-2`}
									id="release-date"
									name="release_date"
									type="date"
								/>
								<p className={`${styles.error}`}>{formErrors.release_date}</p>
							</div>
							<div className="mt-3">
								<label className={styles.label} htmlFor="duration">
									Movie Duration *
								</label>
								<input
									onChange={handleChange}
									className={`${styles.input} px-3 py-2`}
									id="duration"
									name="duration"
									type="time"
								/>
								<p className={`${styles.error}`}>{formErrors.duration}</p>
							</div>
						</div>

						{/* labguage & genres */}
						<div className="flex w-[60%]">
							<div className="mr-2">
								<label htmlFor="lang" className={styles.label}>
									Languages *
								</label>
								<select
									id="lang"
									onChange={handleChange}
									name="language"
									multiple
									className={`${styles.input} p-2`}
								>
									{languages.map((lang) => (
										<option value={lang} key={lang}>
											{lang}
										</option>
									))}
								</select>
								<p className={`${styles.error}`}>{formErrors.language}</p>
							</div>
							<div>
								<label htmlFor="genres" className={styles.label}>
									Genres *
								</label>
								<select
									multiple
									onChange={handleChange}
									id="genres"
									name="genre"
									className={`${styles.input} p-2`}
								>
									{movieGenres.map((genre) => (
										<option value={genre} key={genre}>
											{genre}
										</option>
									))}
								</select>
								<p className={`${styles.error}`}>{formErrors.genre}</p>
							</div>
						</div>
					</div>

					{/* radio & checkbox */}
					<div className="my-5 flex justify-start">
						<div>
							<div className="flex items-center mb-4">
								<input
									onChange={handleChange}
									id="adult"
									type="checkbox"
									name="adult"
									className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 "
									checked={formData.adult}
								/>
								<label
									htmlFor="adult"
									className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Adult Movie ?
								</label>
							</div>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className={!isSubmitting ? `${styles.btn}` : `${styles.btn_disabled}`}
					>
						<FileUploadOutlinedIcon /> {isSubmitting ? isSubmitting : "Add movie"}
					</button>
				</form>
			</div>
		</div>
	);
};

const styles = {
	nav_h1: "text-2xl font-semibold text-blue-400",
	radio_input: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ",
	radio_label: "ml-2 text-sm font-medium text-gray-900 dark:text-gray-300",
	input: "block w-full text-sm text-gray-400 border border-gray-500 rounded-lg cursor-pointer bg-gray-800",
	label: "block mb-1 font-extralight text-blue-400",
	btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-md rounded hover:bg-blue-700",
	btn_disabled: "w-full px-6 py-2.5 bg-blue-400 cursor-not-allowed text-white font-medium text-md rounded",
	error: "text-xs text-red-400 px-1 pt-1 font-light",
};

export default MovieForm;
