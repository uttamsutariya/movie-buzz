import { useState, useEffect } from "react";
import Loader from "./Loader";

const seatSet = new Set();

const SeatMap = (props) => {
	const { availableSeats, bookedSeats, rows, cols, handleSelectedSeats } = props;

	const myRows = [];
	const myCols = [];

	const available = availableSeats?.map((seat) => ({ ...seat, isBooked: false }));
	const booked = bookedSeats?.map((seat) => ({ ...seat, isBooked: true }));

	const seats = [...available, ...booked];

	useEffect(() => {
		seatSet.clear();
	}, []);

	/**
	 * creating state variable for managing selected & not selected seats
	 */
	const defaultCheckedSeats = new Array(seats.length).fill(false);
	seats.forEach((seat) => {
		const myIndex = cols * (seat.row - 1) + (seat.col - 1);
		defaultCheckedSeats[myIndex] = seat.isBooked;
	});

	const [checkedSeats, setCheckedSeats] = useState(defaultCheckedSeats);

	const handleSeatChange = (myIndex, e) => {
		/**
		 * if defaultChecked is false =>
		 * 		user want to select that seat =>
		 * 			change defaultChecked option & add to set
		 *
		 * else =>
		 * 		user want to disselect seat =>
		 * 			change defaultChecked option & remove from set
		 * */
		if (checkedSeats[myIndex] == false) {
			seatSet.add(e.target.value);
			const newArr = checkedSeats;
			newArr[myIndex] = true;
			setCheckedSeats([...newArr]);
		} else {
			seatSet.delete(e.target.value);
			const newArr = checkedSeats;
			newArr[myIndex] = false;
			setCheckedSeats([...newArr]);
		}

		handleSelectedSeats(seatSet);
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
			const myIndex = cols * (seat.row - 1) + (seat.col - 1);
			tr.push(
				<input
					className="w-[20px] h-[20px]"
					type="checkbox"
					checked={checkedSeats[myIndex]}
					disabled={seat?.isBooked}
					value={seat?._id}
					name={seat?.name}
					onChange={(e) => handleSeatChange(myIndex, e)}
				/>
			);
		}

		myRows.push(tr);
	}

	if (props.loading) return <Loader msg="loading" />;

	return (
		<div className="p-2 border-2 border-blue-400 rounded-md w-auto">
			<table>
				<thead>
					{myRows.map((row, index) => (
						<tr key={index}>
							{row.map((element, index) => (
								<td className=" bg-white text-black text-sm p-[1px]" key={index}>
									{element}
								</td>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					<tr>
						{myCols.map((col, index) => (
							<th key={index} className="bg-black text-gray-200 text-center text-sm font-light">
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
