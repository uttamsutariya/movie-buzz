import React from "react";
import { Link } from "react-router-dom";
import User from "./UserProfileButton";

import { useAuthState } from "../context";

const Navbar = ({ children }) => {
	const { user } = useAuthState();

	return (
		<nav className="bg-slate-800 mb-5 mx-auto w-[100vw] shadow-sm shadow-gray-400 sticky top-0 z-50">
			<div className="mx-auto px-4 md:px-8 max-w-[1400px]">
				<div className="flex items-center justify-between">
					<div className="w-full justify-between flex items-center py-5">
						<Link className="font-bold text-3xl md:text-4xl" to="/">
							<p className="main-title">MovieBuzz</p>
						</Link>
						<>{children}</>
						<div>
							<div className=" flex space-x-4 items-center">
								{user != null ? (
									<User icon={user.email[0].toUpperCase()} />
								) : (
									<Link to="/login">
										<button
											type="button"
											className="py-2 px-5 bg-blue-600 text-white text-center font-medium rounded-md"
										>
											Login
										</button>
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
