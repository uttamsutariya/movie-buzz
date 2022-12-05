import React, { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../BackButton";

import { loginUser, useAuthDispatch, useAuthState } from "../../context";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		let data = { email, password };

		const dispatch = useAuthDispatch();
		const { loading, error } = useAuthState();

		try {
			let response = await loginUser(dispatch, payload); //loginUser action makes the request and handles all the neccessary state changes
			if (!response.user) return;
			props.history.push("/dashboard"); //navigate to dashboard on success
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.parent}>
			<BackButton />

			<div className={styles.formContainer}>
				<form onSubmit={handleLogin}>
					<div className={styles.formGroup}>
						<input
							type="email"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
							className={styles.inputItem}
							placeholder="Enter email"
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="password"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							className={styles.inputItem}
							placeholder="Password"
						/>
					</div>
					<div className="flex justify-between items-center mb-6">
						<div className="form-group form-check">
							<input
								type="checkbox"
								className="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600  mr-2 cursor-pointer"
								id="exampleCheck2"
							/>
							<label className="form-check-label inline-block text-gray-200" htmlFor="exampleCheck2">
								Remember me
							</label>
						</div>
						<a href="#!" className="text-blue-400">
							Forgot password?
						</a>
					</div>
					<button
						type="submit"
						className="
                        w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700"
					>
						Login
					</button>
					<p className="text-gray-200 mt-6 text-center">
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
};

export default Login;
