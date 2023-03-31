import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";

// toast
import { toast } from "react-toastify";

import { signupUser, useAuthDispatch, useAuthState } from "../../context";

const defaultFormData = {
	email: "",
	password: "",
};

const Signup = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const dispatch = useAuthDispatch();
	const { loading } = useAuthState();
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState({});

	const validateInput = (values) => {
		const { email, password } = values;
		const errors = {};
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!email) errors.email = "Email is required";
		else if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
		if (!password) errors.password = "Password is required";
		else if (password.length < 6) errors.password = "Password must be 6 characters long";

		setFormErrors(errors);
		if (Object.keys(errors).length > 0) return true;
		return false;
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateInput(formData)) return;

		const res = await signupUser(dispatch, formData);
		if (res) navigate("/");
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.main}>
			<BackButton />
			<div className={styles.form_container}>
				<p className="text-xl mb-5 font-semibold">Sign Up</p>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className={styles.form_group}>
						<input
							onChange={handleChange}
							type="text"
							name="email"
							className={styles.form_input}
							placeholder="Email"
							value={formData.email}
						/>
						<p className={`${styles.error}`}>{formErrors.email}</p>
					</div>
					<div className={styles.form_group}>
						<input
							onChange={handleChange}
							type="password"
							name="password"
							className={styles.form_input}
							placeholder="Password"
							value={formData.password}
						/>
						<p className={`${styles.error}`}>{formErrors.password}</p>
					</div>

					<button type="submit" className={styles.signup}>
						Sign up
					</button>
					<p className={styles.login}>
						Already have account ?{" "}
						<Link to="../login" replace={true} className="text-blue-400">
							Login
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

const styles = {
	main: "flex justify-center items-center h-[100vh] relative",
	form_container: "block p-6 rounded-lg shadow bg-slate-800 w-80",
	form_group: "form-group mb-3",
	form_input: "text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white outline-none",
	signup: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700",
	login: "text-gray-200 mt-6 text-center",
	error: "text-xs text-red-400 px-1 pt-1 font-light",
};

export default Signup;
