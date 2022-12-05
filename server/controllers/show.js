const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");

// models
const Show = require("../models/show");
const Movie = require("../models/movie");
const CinemaHall = require("../models/cinemaHall");
const Booking = require("../models/booking");

// mail sender
const { sendMail } = require("../helper/mailer");

// booking id generater
const { generateBookingID } = require("../helper/generateBookingID");

const cron = require("node-schedule");

// add new show
exports.addNewShow = asyncHandler(async (req, res, next) => {
	/**
	 * 1. select movie, price, dateTime, cinemaHall
	 * 2. cerate show document
	 * 3. create Seat document for each seat available in cinemaHall,
	 * 4. add all seats to availableSeats in show document
	 */

	let { movie, price, dateTime, cinemaHall } = req.body;

	if (!movie || !cinemaHall) return next(new CustomError("Provide movie & cinema hall", 400));

	dateTime = new Date(dateTime);

	if (+dateTime <= Date.now()) return next(new CustomError("Please select appropriate date & time", 400));

	// cinema can add show only for released movies
	const movieDoc = await Movie.findOne({ _id: movie, status: "released" }, { duration: 1, title: 1 });

	if (!movieDoc) return next(new CustomError("Can't add show for this movie", 400));

	// check cinema hall
	const hall = await CinemaHall.findOne({ _id: cinemaHall });

	if (!hall) return next(new CustomError("Cinema hall doesn't exist", 400));

	let startTime = new Date(dateTime);

	// endtime = startTime + movie duration + 10 minutes (of interval)
	let endTime = new Date(startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000);

	// create show data object to create show document
	const showData = {
		movie,
		price,
		date: dateTime,
		startTime,
		endTime,
		cinemaHall,
	};

	// find in Show collection if there is already a show for a given time
	let show = await Show.findOne({
		cinemaHall,
		startTime: { $lte: startTime },
		endTime: { $gte: startTime },
	});

	// if show exist => can't create a new show
	if (show) return next(new CustomError("In between show for selected time", 400));

	// create show
	show = await Show.create(showData);

	const seatMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	// create seat document for each seat for booking purpose
	for (let row = 0; row < hall.totalRows; row++) {
		for (let col = 0; col < hall.totalColumns; col++) {
			let seatName = seatMap[row] + (col + 1);

			const seatDoc = {
				name: seatName,
				row: row + 1,
				col: col + 1,
			};

			show.availableSeats.push(seatDoc);
		}
	}

	await show.save();

	res.status(201).json({
		status: "success",
		message: "new show added",
		data: { show },
	});

	// schedule job for show start & show end

	cron.scheduleJob(show.startTime, async () => {
		show.status = "started";
		await show.save();

		console.log(`show cron ran at: ${new Date().toUTCString()} for ${movieDoc.title}`);
	});

	cron.scheduleJob(show.endTime, async () => {
		show.status = "ended";
		await show.save();

		console.log(`show cron ran at: ${new Date().toUTCString()} for ${movieDoc.title}`);
	});
});

// book a show
exports.bookShow = asyncHandler(async (req, res, next) => {
	const { seats, show } = req.body;

	if (!seats || seats.length === 0) return next(new CustomError("Please select a seat", 400));

	if (!show) return next(new CustomError("Please select a show", 400));

	// remove selected seats from show.availableSeats and insert into show.bookedSeats
	const showDoc = await Show.findOne(
		{ _id: show },
		{ availableSeats: 1, bookedSeats: 1, price: 1, date: 1, startTime: 1 }
	).populate([
		{
			path: "movie",
			model: "Movie",
			select: "title",
		},
		{
			path: "cinemaHall",
			model: "CinemaHall",
			select: "screenName",
		},
	]);

	if (!showDoc) return next(new CustomError("Show not found", 400));

	let availableSeats = showDoc.availableSeats;
	let bookedSeats = showDoc.bookedSeats;
	let userSeats = [];

	// check if selected seats are available or not

	for (let seatId of seats) {
		const aSeat = availableSeats.find((seat) => seat._id.toString() === seatId.toString());
		if (!aSeat) return next(new CustomError("Seat not available"));
	}

	// iterating over selected seats and adding them to booked seats
	for (let seatId of seats) {
		availableSeats = availableSeats.filter((seat) => {
			if (seat._id.toString() === seatId.toString()) {
				userSeats.push(seat.name);
				bookedSeats.push(seat);
			}

			return seat._id.toString() !== seatId.toString();
		});
	}

	showDoc.availableSeats = availableSeats;
	showDoc.bookedSeats = bookedSeats;

	await showDoc.save();

	// generate booking id
	const bookingId = generateBookingID();

	let totalAmount = showDoc.price * userSeats.length;

	const bookingDoc = {
		seats: userSeats,
		show: {
			id: show,
			title: showDoc.movie.title,
			screenName: showDoc.cinemaHall.screenName,
			date: showDoc.date,
			startTime: showDoc.startTime,
			price: showDoc.price,
		},
		totalAmount,
		bookingId,
		user: req.user._id,
	};

	const booking = await Booking.create(bookingDoc);

	// send mail & sms after booking
	if (booking) {
		sendMail(req.user.email, "uMovies Show Booked", `Your ticket are booked. Your seats are : ${userSeats}`);
	}

	res.status(201).json({
		status: "success",
		message: "show booked successfully",
		data: {
			booking,
		},
	});
});

// update show details
exports.updateShowDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Please provide showId", 400));

	/**
	 * find if there is any booking for this show
	 * if yes -> cinema can' update show details
	 * else -> cinema can update any show details
	 */

	const show = await Show.findOne({ _id: showId }).populate({
		path: "cinemaHall",
		model: "CinemaHall",
		select: "screenName totalSeats",
	});

	if (!show) return next(new CustomError("Show not found", 400));

	const isAnyBooking = await Booking.findOne({ show: showId }, { _id: 1 });

	if (isAnyBooking) return next(new CustomError("Can't update this show, because there is booking", 400));

	// destructure update data
	let { movie, price, dateTime, cinemaHall } = req.body;

	/**
	 * if there is update in cinemaHall we also need to update available seats
	 */
	if (cinemaHall) {
		// finding cinemaHall
		const hall = await CinemaHall.findOne({ _id: cinemaHall });

		// assign new cinemaHall to show
		show.cinemaHall = cinemaHall;
		show.availableSeats = [];

		const seatMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		// assign new seats of new cinema hall to show
		for (let row = 0; row < hall.totalRows; row++) {
			for (let col = 0; col < hall.totalColumns; col++) {
				let seatName = seatMap[row] + (col + 1);

				const seatDoc = {
					name: seatName,
					row: row + 1,
					col: col + 1,
				};

				show.availableSeats.push(seatDoc);
			}
		}
	}

	// update other details
	if (movie) show.movie = movie;
	if (price) show.price = price;
	if (dateTime) {
		dateTime = new Date(dateTime);
		show.date = dateTime;
		show.startTime = dateTime;

		const movieDoc = await Movie.findOne({ _id: movie }, { duration: 1 });

		// endtime = startTime + movie duration + 10 minutes (of interval)
		show.endTime = new Date(show.startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000);
	}

	// save the updated show document
	await show.save();

	res.status(200).json({
		status: "success",
		message: "show updated successfully",
		data: {
			show,
		},
	});
});

// get show list by movie id
exports.getShowByMovie = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Please add movie id", 400));

	const movie = await Movie.findOne({ _id: movieId }, { title: 1, _id: 0 });

	if (!movie) return next(new CustomError("Movie not found with this id", 400));

	const shows = await Show.find(
		{ movie: movieId },
		{ movie: 0, endTime: 0, status: 0, availableSeats: 0, bookedSeats: 0, createdAt: 0, updatedAt: 0 }
	)
		.sort({ createdAt: -1 })
		.populate([
			{
				path: "cinemaHall",
				model: "CinemaHall",
				select: "screenName",
			},
		]);

	let message;

	if (shows.length === 0) message = "No available show for this movie !";
	else message = "Show list fetched";

	res.status(200).json({
		status: "success",
		message,
		data: {
			movie: movie.title,
			totalShows: shows.length,
			shows,
		},
	});
});

// get show seats details
exports.getShowSeatsDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Please add showId", 400));

	const show = await Show.findOne({ _id: showId }, { price: 1, availableSeats: 1, bookedSeats: 1 }).populate({
		path: "cinemaHall",
		model: "CinemaHall",
		select: "totalRows totalColumns -_id",
	});

	if (!show) return next(new CustomError("Show not found", 400));

	return res.status(200).json({
		status: "success",
		message: "show detais fetched",
		data: {
			show,
		},
	});
});
