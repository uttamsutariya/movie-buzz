const Ticket = ({ imgUrl }) => {
	return (
		<div className="flex max-w-md mx-2 my-3 bg-white shadow-lg rounded-lg overflow-hidden">
			<div className="w-1/3 bg-cover bg-landscape">
				<img src={imgUrl} alt="movie-name" />
			</div>
			<div className="w-2/3 p-4">
				<h1 className="text-gray-900 font-bold text-2xl">Black Adam</h1>
				<ul className="my-2">
					<li className="">
						<p className="text-sm">
							<span className="text-black">Booking ID : </span>
							<span className="text-gray-500">EFGS54</span>
						</p>
					</li>
					<li className="">
						<p className="text-sm">
							<span className="text-black">Screen : </span>
							<span className="text-gray-500">Green</span>
						</p>
					</li>
					<li className="">
						<p className="text-sm">
							<span className="text-black">Date & Time : </span>
							<span className="text-gray-500">22 Dec, 2022 : 11 AM</span>
						</p>
					</li>
					<li className="">
						<p className="text-sm">
							<span className="text-black">Seats : </span>
							<span className="text-gray-500">A1, A2, A3</span>
						</p>
					</li>
					<li className="">
						<p className="text-sm">
							<span className="text-black">Amount : </span>
							<span className="text-gray-500">450 INR</span>
						</p>
					</li>
				</ul>
				<div className="flex item-center justify-start mt-4">
					<button className="px-3 py-2 w-full mr-3 bg-blue-600 text-white text-xs rounded">
						Download Ticket
					</button>
				</div>
			</div>
		</div>
	);
};

export default Ticket;
