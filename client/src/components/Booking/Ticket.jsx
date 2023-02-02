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
		isExpired,
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
			name: "Date : ",
			value: <Date date={date} />,
		},
		{
			name: "Time : ",
			value: <Time date={date} />,
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
			{isExpired ? (
				<div className="absolute top-5 right-[-30px] bg-red-500 px-8 rotate-[45deg]">
					<p className="text-white font-semibold">Expired</p>
				</div>
			) : null}
			<div className={styles.image_container}>
				<img className="w-[100%] h-auto" src={poster} alt={title} />
			</div>
			<div className={styles.details_container}>
				<h1 className={styles.h1}>{title.length > 15 ? `${title?.substr(0, 15)} . . .` : title}</h1>
				<ul>
					{LIST_ITEMS.map((item, index) => (
						<li key={index}>
							<p className="text-sm">
								<span className="text-black font-semibold">{item.name}</span>
								<span className="text-gray-700">{item.value}</span>
							</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const styles = {
	container: "flex max-w-sm mx-2 my-2 bg-white rounded overflow-hidden relative",
	image_container: "w-1/3",
	details_container: "w-2/3 p-1 md:p-2",
	h1: "text-gray-900 font-bold text-xl md:text-2xl",
	btn_container: "flex item-center justify-start",
	btn: "px-3 py-2 w-full mr-3 bg-blue-600 text-white text-xs rounded",
};

export default Ticket;
