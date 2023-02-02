import { Link } from "react-router-dom";

// components
import Navbar from "./Navbar";

const Home = () => {
	return (
		<>
			<Navbar />
			<div className="w-full h-[70vh] p-2 mx-auto text-center flex flex-col justify-center items-center">
				<h1 className="text-5xl md:text-7xl md:py-6 font-bold text-center">
					<span className="text-7xl">👋</span> <br /> Welcome
				</h1>
				<div className="flex justify-center items-center my-5 px-4 md:w-[900px]">
					<p className="text-[30px] md:text-3xl font-bold text-gray-600 text-center">
						Experience the easy and fastest movie ticket booking with us
					</p>
				</div>

				<Link to="/movies" className="inline-block">
					<button className="bg-blue-600 w-[200px] rounded-md font-medium my-6 px-3 py-3 text-white">
						Get Started
					</button>
				</Link>
			</div>

			{/* footer */}
			<div className="fixed bottom-0 flex justify-center w-full">
				<p className="text-gray-500">🤩 use chrome for enhanced performance</p>
			</div>
		</>
	);
};

export default Home;
