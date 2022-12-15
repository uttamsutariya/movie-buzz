import React, { useState } from "react";
import axios from "axios";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import { toast } from "react-toastify";

const ForgotPass = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	// login handler
	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		try {
			const res = await axios.post("api/user/forgotPassword", { email });
			toast.success(res.data.message);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setIsDisabled(true);
			setLoading(false);
		}
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<p className="mb-5 text-center">Enter your email, we will send you password reset link</p>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className={styles.formGroup}>
						<input
							type="email"
							name="email"
							onChange={(e) => {
								setIsDisabled(false);
								setEmail(e.target.value);
							}}
							className={styles.inputItem}
							placeholder="Email"
							required
						/>
					</div>

					<button
						disabled={isDisabled}
						type="submit"
						className={isDisabled ? `${styles.login_btn_disabled}` : `${styles.login_btn}`}
					>
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
	utils_div: "flex justify-center items-center my-2",
	login_btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded",
	login_btn_disabled: "w-full px-6 py-2.5 bg-blue-400 cursor-not-allowed text-white font-medium text-sm rounded",
	signup_link: "text-gray-200 mt-6 text-center",
};

export default ForgotPass;
