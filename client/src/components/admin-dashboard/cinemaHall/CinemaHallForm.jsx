import { useState, useEffect } from "react";
import axios from "axios";

// components
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Navbar from "../navigation/Navbar";
import Loader from "../../Loader";

const defaultFormData = {
	name: "",
	columns: 0,
	rows: 0,
};

const CinemaHallForm = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		setLoading(true);
		e.preventDefault();

		axios
			.post(`/api/admin/cinemaHall`, formData)
			.then((res) => {
				setLoading(false);
				alert("Cinemahall added succesfully");
			})
			.catch((error) => {
				setError("Something went wrong");
			});
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="h-[100vh] overflow-auto">
			<Navbar child={<h1 className={styles.nav_h1}>Add new cinemahall</h1>} />

			<div className="m-5 p-5 bg-slate-800 rounded-lg">
				<form onSubmit={handleSubmit} className="w-[40%] m-auto" autoComplete="off">
					{/* Name */}
					<div className="flex flex-col justify-start space-x-20">
						<div>
							<label className={styles.label} htmlFor="title">
								Screen Name
							</label>
							<input
								onChange={handleChange}
								id="title"
								type="text"
								name="name"
								className={`${styles.input} px-3 py-2 w-[100%]`}
								placeholder="Name"
								required
							/>
						</div>
					</div>

					{/* total columns */}
					<div className="flex flex-col justify-start space-x-20">
						<div>
							<label className={styles.label} htmlFor="title">
								Total Columns
							</label>
							<input
								onChange={handleChange}
								id="title"
								type="number"
								name="columns"
								min="7"
								max="40"
								className={`${styles.input} px-3 py-2 w-[100%]`}
								placeholder="Columns"
								required
							/>
						</div>
					</div>

					{/* total rows */}
					<div className="flex flex-col justify-start space-x-20">
						<div>
							<label className={styles.label} htmlFor="title">
								Total Rows
							</label>
							<input
								onChange={handleChange}
								id="title"
								type="number"
								name="rows"
								min="7"
								max="40"
								className={`${styles.input} px-3 py-2 w-[100%]`}
								placeholder="Rows"
								required
							/>
						</div>
					</div>

					<button
						type="submit"
						className="
                        w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-md rounded hover:bg-blue-700"
					>
						<FileUploadOutlinedIcon /> Add new cinemahall
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
};

export default CinemaHallForm;
