import { useState } from "react";
import Loader from "./Loader";

const SeatMap = (props) => {
	const { availableSeats, bookedSeats, rows, cols } = props;

	const myRows = [];
	const myCols = [];

	const available = availableSeats?.map((seat) => ({ ...seat, isBooked: false }));
	const booked = bookedSeats?.map((seat) => ({ ...seat, isBooked: true }));

	const seats = [...available, ...booked];

	const seatSet = new Set();

	/**
	 * creating state variable for managing selected & not selected seats
	 */
	const checkedSeat = new Array(seats.length).fill(false);
	seats.forEach((seat) => {
		checkedSeat[seat.row * seat.col - 1] = seat.isBooked;
	});

	const handleSeatChange = (e) => {
		/**
		 * if defaultChecked is false =>
		 * 		user want to select that seat =>
		 * 			change defaultChecked option & add to set
		 *
		 * else =>
		 * 		user want to disselect seat =>
		 * 			change defaultChecked option & remove from set
		 * */

		console.log(e.target.defaultChecked);

		if (!e.target.defaultChecked) {
			e.target.defaultChecked = true;

			console.log(e.target.defaultChecked);

			seatSet.add(e.target.value);
		} else {
			e.target.defaultChecked = false;
			console.log(e.target.defaultChecked);
			console.log(seatSet.has(e.target.value));
			seatSet.delete(e.target.value);
		}

		console.log(seatSet);
		console.log(e.target.value, e.target.defaultChecked);
	};

	const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	myCols.push("");

	for (let col = 0; col < cols; col++) {
		myCols.push(col + 1);
	}

	for (let row = 1; row <= rows; row++) {
		let tr = [];
		tr.push(str[row - 1]);
		for (let col = 1; col <= cols; col++) {
			const seat = seats.find((seat) => seat.row === row && seat.col === col);
			tr.push(
				<input
					className="w-[15px] h-[15px]"
					type="checkbox"
					name=""
					checked={seat?.isBooked}
					disabled={seat?.isBooked}
					value={seat?._id}
					onChange={handleSeatChange}
				/>
			);
		}

		myRows.push(tr);
	}

	if (props.loading) return <Loader msg="loading" />;

	return (
		<div className="p-1 bg-blue-400 rounded-lg w-auto">
			<table>
				<thead>
					{myRows.map((row, index) => (
						<tr key={index}>
							{row.map((element, index) => (
								<td className=" bg-white text-black text-sm p-[2px]" key={index}>
									{element}
								</td>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					<tr>
						{myCols.map((col, index) => (
							<th key={index} className="bg-black p-1 text-gray-200 text-center text-sm font-light">
								{col}
							</th>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default SeatMap;
