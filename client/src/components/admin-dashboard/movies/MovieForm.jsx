import { useState } from "react";
import axios from "axios";

// components
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Navbar from "../navigation/Navbar";
import Loader from "../../util/Loader";

// toast
import { toast } from "react-toastify";

import { movieGenres, languages } from "../../../../constants";

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
		status: "released",
		adult: false,
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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

	const handleSubmit = (e) => {
		setLoading(true);
		e.preventDefault();

		let uploadData = new FormData();

		for (let key in formData) {
			if (key == "poster" || key == "banner") uploadData.set(key, formData[key], formData[key].name);
			else uploadData.set(key, formData[key]);
		}

		axios
			.post(`/api/admin/movies`, uploadData)
			.then((res) => {
				setLoading(false);
				toast.success("Movie added successfully");
			})
			.catch((error) => {
				setError("Something went wrong");
			});
	};

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar child={<h1 className={styles.nav_h1}>Add New Movie</h1>} />

			<div className="m-5 p-5 bg-slate-800 rounded-lg">
				<form onSubmit={handleSubmit} className="w-[60%] m-auto" autoComplete="off">
					{/* movie title */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="title">
							Title
						</label>
						<input
							onChange={handleChange}
							id="title"
							name="title"
							type="text"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Movie title"
							required
						/>
					</div>

					{/* movie description */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="desc">
							Description
						</label>
						<textarea
							onChange={handleChange}
							id="desc"
							name="description"
							className={`${styles.input} px-3 py-2 w-[100%] resize-none`}
							rows={1}
							placeholder="Enter Movie Description"
							required
						/>
					</div>

					{/* actors */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="cast">
							Actors (cast)
						</label>
						<input
							onChange={handleChange}
							id="cast"
							type="text"
							name="actors"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Enter comma separated values"
							required
						/>
					</div>

					{/* trailer link */}
					<div className="mb-6">
						<label className={styles.label} htmlFor="trailer">
							Trailer Link
						</label>
						<input
							onChange={handleChange}
							id="trailer"
							type="text"
							name="trailer_link"
							className={`${styles.input} px-3 py-2 w-[100%]`}
							placeholder="Enter youtube trailer link"
							required
						/>
					</div>

					{/* image upload */}
					<div className="mb-6 flex justify-between">
						{/* poster image  */}
						<div>
							<label className={styles.label} htmlFor="poster">
								Poster Image
							</label>
							<input
								onChange={handleChange}
								className={styles.input}
								id="poster"
								type="file"
								name="poster"
								required
							/>
						</div>
						{/* banner image */}
						<div>
							<label className={styles.label} htmlFor="banner">
								Banner Image
							</label>
							<input
								onChange={handleChange}
								className={styles.input}
								id="banner"
								type="file"
								name="banner"
								required
							/>
						</div>
					</div>

					<div className="mb-6 flex justify-start space-x-20">
						{/* date & duration */}
						<div className="w-[40%]">
							<div>
								<label className={styles.label} htmlFor="release-date">
									Release Date
								</label>
								<input
									onChange={handleChange}
									className={`${styles.input} px-3 py-2`}
									id="release-date"
									name="release_date"
									type="date"
									required
								/>
							</div>
							<div>
								<label className={styles.label} htmlFor="duration">
									Movie Duration
								</label>
								<input
									onChange={handleChange}
									className={`${styles.input} px-3 py-2`}
									id="duration"
									name="duration"
									type="time"
									required
								/>
							</div>
						</div>

						{/* labguage & genres */}
						<div className="flex w-[60%]">
							<div className="mr-2">
								<label htmlFor="lang" className={styles.label}>
									Languages
								</label>
								<select
									id="lang"
									onChange={handleChange}
									name="language"
									multiple
									className={`${styles.input} p-2`}
									required
								>
									{languages.map((lang) => (
										<option value={lang} key={lang}>
											{lang}
										</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor="genres" className={styles.label}>
									Genres
								</label>
								<select
									multiple
									onChange={handleChange}
									id="genres"
									name="genre"
									className={`${styles.input} p-2`}
									required
								>
									{movieGenres.map((genre) => (
										<option value={genre} key={genre}>
											{genre}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* radio & checkbox */}
					<div className="my-5 flex justify-start">
						<div className="mr-10">
							<div className="flex items-center mb-4">
								<input
									onChange={handleChange}
									id="released"
									type="radio"
									value="released"
									name="status"
									className={styles.radio_input}
									defaultChecked
								/>
								<label htmlFor="released" className={styles.radio_label}>
									Released
								</label>
							</div>
							<div className="flex items-center">
								<input
									onChange={handleChange}
									id="coming-soon"
									type="radio"
									value="coming soon"
									name="status"
									className={styles.radio_input}
								/>
								<label htmlFor="coming-soon" className={styles.radio_label}>
									Coming soon
								</label>
							</div>
						</div>
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
						className="
                        w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-md rounded hover:bg-blue-700"
					>
						<FileUploadOutlinedIcon /> Add movie
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
	input: "block w-full mb-5 text-sm text-gray-400 border border-gray-500 rounded-lg cursor-pointer bg-gray-800",
	label: "block mb-2 font-extralight text-blue-400",
};

export default MovieForm;
