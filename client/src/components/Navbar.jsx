import React from "react";
import { Link } from "react-router-dom";
import User from "./UserProfileButton";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuthState } from "../context";

const Navbar = () => {
	const { user } = useAuthState();

	return (
		<nav className="bg-slate-800 mb-5 mx-auto w-[100vw] shadow-xl sticky top-0 z-50">
			<div className="mx-auto px-8 max-w-[1400px]">
				<div className="flex items-center justify-between">
					<div className="w-full justify-between flex items-center py-5">
						<a href="https://github.com/uttamsutariya">
							<button type="button" className=" text-white text-center font-medium rounded-md">
								<GitHubIcon fontSize="large" />
							</button>
						</a>
						<Link className="font-bold text-2xl" to="/">
							uMovies
						</Link>
						<div>
							<div className=" flex space-x-4 items-center">
								{user != null ? (
									<User icon={user.username[0].toUpperCase()} />
								) : (
									<Link to="/login">
										<button
											type="button"
											className="py-1 px-4 bg-blue-600 text-white text-center font-medium rounded-lg"
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
