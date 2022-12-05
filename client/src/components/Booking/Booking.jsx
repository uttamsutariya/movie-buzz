import Navbar from "../Navbar";
import Ticket from "./Ticket";
import BackButton from "../BackButton";

const bookings = [
	{
		url: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/thank-god-et00318167-1665398727.jpg",
	},
	{
		url: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/black-adam-et00117411-1665552700.jpg",
	},
	{
		url: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/black-panther-wakanda-forever-et00310792-1666006244.jpg",
	},
	{
		url: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/black-adam-et00117411-1665552700.jpg",
	},
];

const Booking = () => {
	return (
		<>
			<Navbar />
			<div className="max-w-[1296px] my-2 mx-auto w-full p-10 bg-slate-800 rounded-2xl relative">
				<BackButton />
				<div className="text-4xl text-white text-center mb-3">My Bookings</div>
				<div className="flex justify-center items-center flex-wrap">
					{bookings.map((booking, index) => (
						<Ticket imgUrl={booking.url} key={index} />
					))}
				</div>
			</div>
		</>
	);
};

export default Booking;
