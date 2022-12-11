import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";

import { loginUser, useAuthDispatch, useAuthState } from "../../context";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useAuthDispatch();
	const { loading } = useAuthState();

	const navigate = useNavigate();

	// login handler
	const handleLogin = async (e) => {
		e.preventDefault();
		let data = { email, password };

		let user = await loginUser(dispatch, data);
		if (!user) return;
		user?.role == 1 ? navigate("/admin") : navigate(-1);
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<form onSubmit={handleLogin} autoComplete="off">
					<div className={styles.formGroup}>
						<input
							type="email"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
							className={styles.inputItem}
							placeholder="Enter email"
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="password"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							className={styles.inputItem}
							placeholder="Password"
							required
						/>
					</div>
					<div className={styles.utils_div}>
						<div>
							<input type="checkbox" className={styles.checkbox_input} id="exampleCheck2" />
							<label className={styles.checkbox_label} htmlFor="exampleCheck2">
								Remember me
							</label>
						</div>
						<a href="#!" className="text-blue-400">
							Forgot password?
						</a>
					</div>
					<button type="submit" className={styles.login_btn}>
						Login
					</button>
					<p className={styles.signup_link}>
						Don't have account ?{" "}
						<Link to="../signup" replace={true} className="text-blue-400">
							SignUp
						</Link>
					</p>
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
	utils_div: "flex justify-between items-center mb-6",
	checkbox_input: "h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600  mr-2 cursor-pointer",
	checkbox_label: "form-check-label inline-block text-gray-200",
	login_btn: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700",
	signup_link: "text-gray-200 mt-6 text-center",
};

export default Login;
