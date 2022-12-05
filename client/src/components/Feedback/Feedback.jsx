import Navbar from "../Navbar";
import BackButton from "../BackButton";

const Feedback = () => {
	return (
		<>
			<Navbar />
			<div className="my-5 max-w-[1296px] m-auto">
				<div className="bg-slate-800 p-5 rounded-lg relative">
					<BackButton />
					<div className="text-center my-3">
						<h1 className="text-4xl font-semibold">Your Feedback is importtant for us !</h1>
					</div>
					<div className="w-[50%] m-auto mt-5">
						<form action="">
							<textarea
								id="feedback"
								rows={10}
								className="resize-none  text-sm rounded-lg  block w-full p-5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
								placeholder="Write your message here !"
								required
							></textarea>
							<button
								type="submit"
								className="bg-blue-600 w-full rounded-md font-medium my-6 px-3 py-3 text-white"
							>
								Submit your feedback
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Feedback;
