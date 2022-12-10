import Date from "../util/Date";
import Time from "../util/Time";
import ArrayString from "../util/ArrayString";

const Ticket = ({ booking }) => {
	const {
		show: { screenName, date, startTime },
		totalAmount,
		bookingId,
		seats,
		movie: {
			images: { poster },
			title,
		},
	} = booking;

	const LIST_ITEMS = [
		{
			name: "Booking ID : ",
			value: bookingId,
		},
		{
			name: "Screen : ",
			value: screenName,
		},
		{
			name: "Date & Time : ",
			value: (
				<>
					<Date date={date} /> {", "}
					<Time date={startTime} />
				</>
			),
		},
		{
			name: "Seats : ",
			value: <ArrayString arr={seats} />,
		},
		{
			name: "Amount : ",
			value: `${totalAmount} INR`,
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.image_container}>
				<img src={poster} alt={title} />
			</div>
			<div className={styles.details_container}>
				<h1 className={styles.h1}>{title}</h1>
				<ul className="my-2">
					{LIST_ITEMS.map((item, index) => (
						<li key={index}>
							<p className="text-sm">
								<span className="text-black">{item.name}</span>
								<span className="text-gray-500">{item.value}</span>
							</p>
						</li>
					))}
				</ul>
				<div className={styles.btn_container}>
					<button className={styles.btn}>Download Ticket</button>
				</div>
			</div>
		</div>
	);
};

const styles = {
	container: "flex max-w-md mx-2 my-3 bg-white shadow-lg rounded shadow-lg overflow-hidden",
	image_container: "w-1/3 bg-cover bg-landscape",
	details_container: "w-2/3 p-4",
	h1: "text-gray-900 font-bold text-2xl",
	btn_container: "flex item-center justify-start mt-4",
	btn: "px-3 py-2 w-full mr-3 bg-blue-600 text-white text-xs rounded",
};

export default Ticket;
