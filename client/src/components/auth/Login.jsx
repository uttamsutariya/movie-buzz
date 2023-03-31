import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";

import { loginUser, useAuthDispatch, useAuthState } from "../../context";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState({});

	const dispatch = useAuthDispatch();
	const { loading } = useAuthState();

	const navigate = useNavigate();

	const validateInput = (values) => {
		const { email, password } = values;
		const errors = {};
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!email) errors.email = "Email is required";
		else if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
		if (!password) errors.password = "Password is required";

		setFormErrors(errors);
		if (Object.keys(errors).length > 0) return true;
		return false;
	};

	// login handler
	const handleLogin = async (e) => {
		e.preventDefault();
		let data = { email, password };

		if (validateInput({ email, password })) return;

		let user = await loginUser(dispatch, data);
		if (!user) return;
		user?.role == 1 ? navigate("/admin") : navigate("/movies");
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<p className="text-xl mb-5 font-semibold">Log In</p>
				<form onSubmit={handleLogin} autoComplete="off">
					<div className={styles.formGroup}>
						<input
							type="text"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={styles.inputItem}
							placeholder="Enter email"
						/>
						<p className={`${styles.error}`}>{formErrors.email}</p>
					</div>
					<div className={styles.formGroup}>
						<input
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={styles.inputItem}
							placeholder="Password"
						/>
						<p className={`${styles.error}`}>{formErrors.password}</p>
					</div>

					<button type="submit" className={styles.login_btn}>
						Login
					</button>
					<p className={styles.signup_link}>
						New user ?{" "}
						<Link to="../signup" replace={true} className="text-blue-400">
							SignUp
						</Link>
					</p>
					<div className={styles.utils_div}>
						<Link to="/user/forgot-password" className="text-blue-400">
							Forgot password ?
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

const styles = {
	parent: "flex justify-center items-center h-[100vh] relative",
	formContainer: "block p-6 rounded-lg shadow bg-slate-800 w-80",
	formGroup: "form-group mb-3",
	inputItem: "text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white outline-none",
	utils_div: "flex justify-center items-center my-2",
	login_btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700",
	signup_link: "text-gray-200 mt-6 text-center",
	error: "text-xs text-red-400 px-1 pt-1 font-light",
};

export default Login;
