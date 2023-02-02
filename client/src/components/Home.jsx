import { Link } from "react-router-dom";

// components
import Navbar from "./Navbar";

const Home = () => {
	return (
		<>
			<Navbar />
			<div className="w-full h-[85vh] p-2 mx-auto text-center flex flex-col justify-center items-center">
				<h1 className="text-4xl sm:text-6xl md:text-7xl md:py-6 font-bold">Welcome to uMovies</h1>
				<div className="flex justify-center items-center py-4">
					<p className="text-3xl  font-bold text-gray-600">
						Get Easy and fastest movie booking experience with us
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
