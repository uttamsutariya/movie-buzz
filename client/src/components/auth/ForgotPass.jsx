import React, { useState } from "react";
import axios from "axios";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import { toast } from "react-toastify";

const ForgotPass = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({});

	// login handler
	const handleSubmit = async (e) => {
		e.preventDefault();

		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!email) {
			setFormErrors({ email: "Email is required" });
			return;
		} else if (!emailRegex.test(email)) {
			setFormErrors({ email: "Please enter valid email" });
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post("api/user/forgotPassword", { email });
			toast.success(res.data.message);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<p className="text-xl mb-2 font-semibold">Forgot Password ?</p>
				<p className="mb-4 text-sm text-gray-500">Enter your email, we will send you password reset link</p>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className={styles.formGroup}>
						<input
							type="text"
							name="email"
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							className={styles.inputItem}
							placeholder="Email"
							value={email}
						/>
						<p className={`${styles.error}`}>{formErrors.email}</p>
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
	formGroup: "form-group mb-3",
	inputItem:
		"text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600",
	utils_div: "flex justify-center items-center my-2",
	login_btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded",
	signup_link: "text-gray-200 mt-6 text-center",
	error: "text-xs text-red-400 px-1 pt-1 font-light",
};

export default ForgotPass;
