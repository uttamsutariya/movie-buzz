import React from "react";
import Logo from "../../assets/images/404.svg";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
	const navigate = useNavigate();

	return (
		<div className="max-w-[1296px] m-auto flex flex-col justify-center items-center h-[100vh] space-y-10">
			<img
				src={Logo}
				className="w-[500px] h-auto"
				alt="404 page not found"
			/>
			<p className="text-4xl font-extrabold">Page not found</p>
			<button
				onClick={() => navigate(-1)}
				className="text-2xl text-blue-400 underline"
			>
				Go back
			</button>
		</div>
	);
};

export default Error404;
