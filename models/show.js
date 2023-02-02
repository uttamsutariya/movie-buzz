const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const seatSchema = new Schema({
	name: String,
	row: Number,
	col: Number,
});

const showSchema = new Schema(
	{
		movie: {
			type: SchemaTypes.ObjectId,
			ref: "Movie",
			required: [true, "movie is required"],
		},
		price: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: [true, "show date is required"],
		},
		startTime: {
			type: Date,
			required: [true, "show start time is required"],
		},
		endTime: {
			type: Date,
			required: [true, "show end time is required"],
		},
		status: {
			type: String,
			enum: ["starting soon", "started", "ended"],
			default: "starting soon",
		},
		cinemaHall: {
			type: SchemaTypes.ObjectId,
			ref: "CinemaHall",
			required: true,
		},
		availableSeats: [
			{
				type: seatSchema,
			},
		],
		bookedSeats: [
			{
				type: seatSchema,
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
