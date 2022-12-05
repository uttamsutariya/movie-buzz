const mongoose = require("mongoose");

const { Schema } = mongoose;

const cinemaHallSchema = new Schema(
	{
		screenName: {
			type: String,
			required: [true, "cinema hall name is required"],
		},
		totalSeats: {
			type: Number,
			required: [true, "Total cinema hall seats is required"],
		}, // rows * columns
		totalRows: {
			type: Number,
			required: [true, "total number of cinema hall rows is required"],
		},
		totalColumns: {
			type: Number,
			required: [true, "total number of cinema hall columns is required"],
		},
	},
	{ timestamps: true, versionKey: false }
);

const CinemaHall = mongoose.model("CinemaHall", cinemaHallSchema);

module.exports = CinemaHall;
