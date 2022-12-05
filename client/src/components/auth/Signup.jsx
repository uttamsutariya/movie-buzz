import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../BackButton";

const Signup = () => {
	return (
		<div className="flex justify-center items-center h-[100vh] relative">
			<BackButton />

			<div className="block p-6 rounded-lg shadow bg-slate-800 w-80">
				<form>
					<div className="form-group mb-6">
						<input
							type="name"
							className="text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
							placeholder="Name"
						/>
					</div>
					<div className="form-group mb-6">
						<input
							type="email"
							className="text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
							placeholder="Email"
						/>
					</div>
					<div className="form-group mb-6">
						<input
							type="password"
							className="text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
							placeholder="Password"
						/>
					</div>
					<div className="form-group mb-6">
						<input
							type="password"
							className="text-sm rounded-lg  block w-full p-2.5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
							placeholder="Confirm Password"
						/>
					</div>

					<button
						type="submit"
						className="
                        w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700"
					>
						Sign up
					</button>
					<p className="text-gray-200 mt-6 text-center">
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

export default Signup;
