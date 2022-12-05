const asyncHandler = require("../middlewares/asyncHandler");
const { cookieToken } = require("../utils/cookieToken");
const CustomError = require("../utils/customError");

const { s3_upload } = require("../helper/imageUploader");

// models
const User = require("../models/user");
const Movie = require("../models/movie");
const CinemaHall = require("../models/cinemaHall");
const Feedback = require("../models/feedback");
const Show = require("../models/show");
const Booking = require("../models/booking");

// login
exports.logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// check if email & password present
	if (!email || !password) return next(new CustomError("Email and password are required", 400));

	// getting user from DB
	const user = await User.findOne({ email, role: 1 }).select("+password +role");

	// if user not exist
	if (!user) {
		return next(new CustomError("Invalid credentials", 400));
	}

	const isPasswordValidate = await user.isValidatedPassword(password);

	// wrong password
	if (!isPasswordValidate) {
		return next(new CustomError("Invalid credentials", 400));
	}

	// sending token in cookie
	cookieToken(user, res);
});

// add movie
exports.addMovie = asyncHandler(async (req, res, next) => {
	let { title, description, release_date, status, language, duration, genre, actors, adult, trailer_link } = req.body;

	if (!req.files) return next(new CustomError("Please upload poster and banner image", 400));

	const { poster, banner } = req.files;

	if (!poster || !banner) return next(new CustomError("Please upload poster and banner image", 400));

	genre = genre.split(",");
	language = language.split(",");
	actors = actors.split(",");

	const posterURL = await s3_upload(poster, "movies/poster", false);
	const bannerURL = await s3_upload(banner, "movies/banner", true);

	const movieData = {
		title,
		description,
		release_date,
		status,
		language,
		duration,
		genre,
		actors,
		adult,
		trailer_link,
		images: { poster: posterURL, banner: bannerURL },
	};

	const movie = await Movie.create(movieData);

	res.status(201).json({
		status: "success",
		message: "movie added successfully",
		data: { movie },
	});
});

// delete movie
exports.deleteMovie = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Provide MovieId", 400));

	await Movie.updateOne({ _id: movieId }, { $set: { status: "deleted" } });

	return res.status(200).json({
		status: "success",
		message: "Movie deleted successfully",
		data: {},
	});
});

// view all added movies
exports.getAllMovies = asyncHandler(async (req, res, next) => {
	const { searchKey } = req.query;

	const regex = new RegExp(searchKey, "i");

	const movies = await Movie.find(
		{ title: regex, status: { $ne: "deleted" } },
		{ title: 1, status: 1, release_date: 1 }
	).sort({
		createdAt: -1,
	});

	let releasedMovies = 0;
	let comingSoonMovies = 0;

	for (let movie of movies) {
		const isAnyShow = await Show.findOne({ movie: movie._id, status: { $ne: "ended" } }, { _id: 1 });

		if (isAnyShow) movie._doc.inAnyShow = true;
		else movie._doc.inAnyShow = false;

		if (movie.status === "released") ++releasedMovies;
		if (movie.status === "coming soon") ++comingSoonMovies;
	}

	return res.status(200).json({
		status: "success",
		message: "movies list fetched",
		data: {
			totalMovies: movies.length,
			releasedMovies,
			comingSoonMovies,
			movies,
		},
	});
});

// add new cinema hall
exports.addCinemaHall = asyncHandler(async (req, res, next) => {
	const { name, rows, columns } = req.body;

	if (!name || !rows || !columns) return next(new CustomError("Name, rows and columns are required"));

	const nameRegex = new RegExp(name, "i");

	let hall = await CinemaHall.findOne({ screenName: nameRegex });

	if (hall) return next(new CustomError("Cinema Hall already exist with this name"));

	const cinemaHallData = {
		screenName: name,
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

// get all cinema hall
exports.getCinemaHalls = asyncHandler(async (req, res, next) => {
	const halls = await CinemaHall.find({}, { createdAt: 0, updatedAt: 0 });

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
	const feedbacks = await Feedback.find({}, { updatedAt: 0 }).sort({ createdAt: -1 }).populate({
		path: "user",
		model: "User",
		select: "username email",
	});

	return res.status(200).json({
		status: "success",
		message: "feedback list fetched",
		data: {
			totalFeedbacks: feedbacks.length,
			feedbacks,
		},
	});
});

// virew show analytics
exports.getAllShowsAndAnalytics = asyncHandler(async (req, res, next) => {
	let shows = await Show.find({}, { createdAt: 0, updatedAt: 0, endTime: 0 })
		.sort({ date: 1 })
		.populate([
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

	let todaysShows = 0;

	shows.forEach((show) => {
		show._doc.totalEarningns = show.bookedSeats.length * show.price;
		show._doc.totalBookings = show.bookedSeats.length;
		show._doc.screen = show.cinemaHall.screenName;
		show._doc.movie = show.movie.title;

		const showDate = new Date(show.date);
		const todaysDate = new Date();

		const sd = showDate.getDate() + "-" + showDate.getMonth() + "-" + showDate.getFullYear();
		const td = todaysDate.getDate() + "-" + todaysDate.getMonth() + "-" + todaysDate.getFullYear();

		if (sd == td) ++todaysShows;

		show.cinemaHall = undefined;
		show.availableSeats = undefined;
		show.bookedSeats = undefined;
	});

	return res.status(200).json({
		status: "success",
		message: "show analytics fetched",
		data: {
			todaysShows,
			totalShows: shows.length,
			shows,
		},
	});
});

// get show details
exports.getShowDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Provide showId", 400));

	const show = await Show.findOne({ _id: showId });

	if (!show) return next(new CustomError("Show not found", 400));

	const bookings = await Booking.find({ "show.id": showId }, { show: 0, updatedAt: 0 }).populate({
		path: "user",
		model: "User",
		select: "username email -_id",
	});

	return res.status(200).json({
		status: "success",
		message: "show booking history fetched",
		data: {
			totalSeats: show.availableSeats.length + show.bookedSeats.length,
			bookedSeats: show.bookedSeats.length,
			availableSeats: show.availableSeats.length,
			price: show.price,
			totalEarningns: show.price * show.bookedSeats.length,
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
