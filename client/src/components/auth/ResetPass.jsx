import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import { toast } from "react-toastify";

const ResetPass = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { userId, token } = useParams();

	// login handler
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Password doesn't match");
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post(`api/user/resetPassword/${userId}/${token}`, { password });
			toast.success(res.data.message);
			setLoading(false);
		} catch (error) {
			toast.error(error.response.data.message);
			setLoading(false);
		}
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className={styles.formGroup}>
						<input
							type="password"
							name="password"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							className={styles.inputItem}
							placeholder="Password"
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="password"
							name="ConfirmPassword"
							onChange={(e) => {
								setConfirmPassword(e.target.value);
							}}
							className={styles.inputItem}
							placeholder="Confirm Password"
							required
						/>
					</div>

					<button type="submit" className={styles.login_btn}>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

const styles = {
	parent: "flex justify-center items-center h-[100vh] relative",
	formContainer: "block p-6 rounded-lg shadow bg-slate-800 w-80",
	formGroup: "form-group mb-6",
	inputItem:
		"text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600",
	login_btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded",
	signup_link: "text-gray-200 mt-6 text-center",
};

export default ResetPass;
