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
	confirmPassword: "",
};

const Signup = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const dispatch = useAuthDispatch();
	const { loading } = useAuthState();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { password, confirmPassword } = formData;

		if (password != confirmPassword) {
			toast.error(`Password don't match`);
			return;
		}

		const res = await signupUser(dispatch, formData);
		if (res) navigate("/");
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<div className={styles.main}>
			<BackButton />

			<div className={styles.form_container}>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className={styles.form_group}>
						<input
							onChange={handleChange}
							type="email"
							name="email"
							className={styles.form_input}
							placeholder="Email"
							required
						/>
					</div>
					<div className={styles.form_group}>
						<input
							onChange={handleChange}
							type="password"
							name="password"
							className={styles.form_input}
							placeholder="Password"
							required
						/>
					</div>
					<div className={styles.form_group}>
						<input
							onChange={handleChange}
							type="password"
							name="confirmPassword"
							className={styles.form_input}
							placeholder="Confirm Password"
							required
						/>
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
	form_group: "form-group mb-6",
	form_input:
		"text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600",
	signup: "w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700",
	login: "text-gray-200 mt-6 text-center",
};

export default Signup;
