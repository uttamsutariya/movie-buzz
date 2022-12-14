exports.formatDate = (date) => {
	const newDate = new Date(date);

	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const day = newDate.getDate();
	const month = monthNames[newDate.getMonth()];
	const year = newDate.getFullYear();

	return `${day} ${month}, ${year}`;
};
exports.formatTime = (d) => {
	const date = new Date(d);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? "0" + minutes : minutes;
	let strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
};
exports.formatSeats = (seatsArr) => seatsArr?.join(", ");
