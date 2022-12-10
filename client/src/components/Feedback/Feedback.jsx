import Navbar from "../Navbar";
import BackButton from "../util/BackButton";
import { useState } from "react";

// toast
import { toast } from "react-toastify";
import axios from "axios";

const Feedback = () => {
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!message) {
			toast.error("Please write your message");
			return;
		}

		const res = await axios.post(`/api/user/feedback`, { message });
		if (res) {
			toast.success("Thanks for your valuable feedback");
		}
	};

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
						<form onSubmit={handleSubmit} autoComplete="off">
							<textarea
								onChange={(e) => setMessage(e.target.value)}
								id="feedback"
								rows={10}
								className="resize-none  text-sm rounded-lg  block w-full p-5 bg-gray-700 placeholder-gray-200 text-white focus:outline-blue-600"
								placeholder="Write your message here !"
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
