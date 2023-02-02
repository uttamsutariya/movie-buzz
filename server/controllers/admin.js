const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const mongoose = require("mongoose");

// models
const CinemaHall = require("../models/cinemaHall");
const Feedback = require("../models/feedback");
const Show = require("../models/show");
const Booking = require("../models/booking");

// add new cinema hall
exports.addCinemaHall = asyncHandler(async (req, res, next) => {
	const { name, rows, columns } = req.body;

	if (!name || !rows || !columns) return next(new CustomError("Name, rows and columns are required"));

	const nameRegex = new RegExp(name, "i");

	let hall = await CinemaHall.findOne({ screenName: nameRegex, deleted: false });

	if (hall) return next(new CustomError("Cinema Hall already exist with this name"));

	const cinemaHallData = {
		screenName: name.toUpperCase(),
		totalRows: rows,
		totalColumns: columns,
		totalSeats: rows * columns,
	};

	hall = await CinemaHall.create(cinemaHallData);

	res.status(201).json({
		status: "success",
		message: "New cinema hall added",
		data: {
			cinemaHall: hall,
		},
	});
});

// delete cinema hall
exports.deleteCinemaHall = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide cinemahall id"));

	await CinemaHall.updateOne({ _id: id }, { $set: { deleted: true } });

	res.status(201).json({
		status: "success",
		message: "cinemaHall deleted successfully",
		data: {
			cinemaHall: id,
		},
	});
});

// get all cinema hall
exports.getCinemaHalls = asyncHandler(async (req, res, next) => {
	let { sortBy, order } = req.query;

	sortBy = sortBy || "screenName";
	order = order || 1;

	const halls = await CinemaHall.find({ deleted: false }, { createdAt: 0, updatedAt: 0 }).sort({
		[`${sortBy}`]: order,
	});

	res.status(201).json({
		status: "success",
		message: "Cinema halls list fetched",
		data: {
			totalHalls: halls.length,
			cinemaHalls: halls,
		},
	});
});

// view all feedbacks
exports.viewFeedback = asyncHandler(async (req, res, next) => {
	let { page, limit } = req.query;

	page = page || 1;
	limit = limit || 5;

	const count = await Feedback.countDocuments({});

	const feedbacks = await Feedback.find({}, { updatedAt: 0 })
		.sort({ createdAt: -1 })
		.limit(page * limit)
		.populate({
			path: "user",
			model: "User",
			select: "username email",
		});

	return res.status(200).json({
		status: "success",
		message: "feedback list fetched",
		data: {
			hasNext: count > page * limit,
			totalFeedbacks: count,
			feedbacks,
		},
	});
});

// view scheduled shows analytics
exports.getScheduledShowsAndAnalytics = asyncHandler(async (req, res, next) => {
	/**
	 * 	show expiry logic
	 */

	let shows = await Show.find({ status: "starting soon" });

	for (let show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

	let { sortBy, order, page, perPage } = req.query;

	sortBy = sortBy || "date";
	order = order || 1;
	page = page || 1;
	perPage = perPage || 5;

	const skipCount = page * parseInt(perPage);
	const limitCount = parseInt(perPage);

	const totalShows = await Show.countDocuments({ status: "starting soon" });

	shows = await Show.aggregate([
		{
			$match: {
				status: "starting soon",
			},
		},
		{
			$lookup: {
				from: "cinemahalls",
				localField: "cinemaHall",
				foreignField: "_id",
				as: "cinemaHall",
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "movie",
				foreignField: "_id",
				as: "movie",
			},
		},
		{
			$unwind: { path: "$cinemaHall" },
		},
		{
			$unwind: { path: "$movie" },
		},
		{
			$sort: { [`${sortBy}`]: parseInt(order) },
		},
		{
			$skip: skipCount,
		},
		{
			$limit: limitCount,
		},
	]);

	shows.forEach((show) => {
		show.totalBookings = show.bookedSeats.length;
		show.availableSeats = undefined;
		show.bookedSeats = undefined;
	});

	if (sortBy == "totalBookings") {
		shows = shows.sort((a, b) => {
			return order == 1 ? b.totalBookings - a.totalBookings : a.totalBookings - b.totalBookings;
		});
	}

	return res.status(200).json({
		status: "success",
		message: "show analytics fetched",
		data: {
			totalShows,
			shows,
		},
	});
});

// view show history and analytics
exports.getShowsHistoryAndAnalytics = asyncHandler(async (req, res, next) => {
	let { sortBy, order, page, perPage } = req.query;

	sortBy = sortBy || "date";
	order = order || -1;
	page = page || 1;
	perPage = perPage || 5;

	const skipCount = page * parseInt(perPage);
	const limitCount = parseInt(perPage);

	const totalShows = await Show.countDocuments({ status: { $ne: "starting soon" } });

	let shows = await Show.aggregate([
		{
			$match: {
				status: { $ne: "starting soon" },
			},
		},
		{
			$lookup: {
				from: "cinemahalls",
				localField: "cinemaHall",
				foreignField: "_id",
				as: "cinemaHall",
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "movie",
				foreignField: "_id",
				as: "movie",
			},
		},
		{
			$unwind: { path: "$cinemaHall" },
		},
		{
			$unwind: { path: "$movie" },
		},
		{
			$sort: { [`${sortBy}`]: parseInt(order) },
		},
		{
			$skip: skipCount,
		},
		{
			$limit: limitCount,
		},
	]);

	shows.forEach((show) => {
		show.totalBookings = show.bookedSeats.length;
		show.totalEarnings = show.price * show.bookedSeats.length;
		show.bookedSeats = undefined;
	});

	if (sortBy == "totalBookings") {
		shows = shows.sort((a, b) => {
			return order == 1 ? b.totalBookings - a.totalBookings : a.totalBookings - b.totalBookings;
		});
	} else if (sortBy == "totalEarnings") {
		shows = shows.sort((a, b) => {
			return order == 1 ? b.totalEarnings - a.totalEarnings : a.totalEarnings - b.totalEarnings;
		});
	}

	return res.status(200).json({
		status: "success",
		message: "show analytics fetched",
		data: {
			totalShows,
			shows,
		},
	});
});

// get show details
exports.getShowDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;
	let { page, perPage } = req.query;

	page = page || 1;
	perPage = perPage || 5;

	const skipCount = page * parseInt(perPage);
	const limitCount = parseInt(perPage);

	if (!showId) return next(new CustomError("Provide showId", 400));

	const show = await Show.findOne({ _id: showId });

	if (!show) return next(new CustomError("Show not found", 400));

	const totalBookings = await Booking.countDocuments({ "show.id": showId });

	const bookings = await Booking.aggregate([
		{
			$match: { "show.id": mongoose.Types.ObjectId(showId) },
		},
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
				pipeline: [
					{
						$project: { email: 1 },
					},
				],
			},
		},
		{
			$unwind: "$user",
		},
		{
			$sort: { createdAt: -1 },
		},
		{
			$skip: skipCount,
		},
		{
			$limit: limitCount,
		},
	]);

	return res.status(200).json({
		status: "success",
		message: "show booking history fetched",
		data: {
			totalBookings,
			totalSeats: show.availableSeats.length + show.bookedSeats.length,
			bookedSeats: show.bookedSeats.length,
			availableSeats: show.availableSeats.length,
			price: show.price,
			totalEarnings: show.price * show.bookedSeats.length,
			bookings,
		},
	});
});

// populate show form fields
exports.populateShowForm = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Provide showId", 400));

	const show = await Show.findOne({ _id: showId }, { movie: 1, price: 1, date: 1, cinemaHall: 1 }).populate([
		{
			path: "cinemaHall",
			model: "CinemaHall",
			select: "screenName",
		},
		{
			path: "movie",
			model: "Movie",
			select: "title",
		},
	]);

	if (!show) return next(new CustomError("Show not found", 400));

	res.status(200).json({
		status: "success",
		message: "show details fetched",
		data: {
			show,
		},
	});
});
