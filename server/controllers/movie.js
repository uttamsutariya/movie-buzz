const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");

const { s3_upload } = require("../helper/imageUploader");

// models
const Movie = require("../models/movie");
const Show = require("../models/show");

/**
 * 	user controller for movies
 */

// get all movies && search movie
exports.userGetAllMovies = asyncHandler(async (req, res, next) => {
	const { searchKey } = req.query;

	/**
	 * if searched by user then give matched result
	 */
	const movieNameRegex = new RegExp(searchKey, "i");

	const movies = await Movie.find(
		{
			$or: [{ title: movieNameRegex }],
			status: { $ne: "deleted" },
		},
		{
			"images.poster": 1,
			title: 1,
			status: 1,
		}
	).sort({
		release_date: -1,
	});

	return res.status(200).json({
		status: "success",
		message: "movies list fetched",
		data: {
			totalMovies: movies.length,
			movies,
		},
	});
});

// get movie detail
exports.getMovieById = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Please add movie id", 400));

	const movie = await Movie.findOne({ _id: movieId }, { createdAt: 0, updatedAt: 0 });

	res.status(200).json({
		status: "success",
		message: "movies details fetched",
		data: {
			movie,
		},
	});
});

/**
 * 	Admin controllers for movies
 */

// add movie
exports.addMovie = asyncHandler(async (req, res, next) => {
	let { title, description, release_date, language, duration, genre, actors, adult, trailer_link } = req.body;

	if (!req.files) return next(new CustomError("Please upload poster and banner image", 400));

	const { poster, banner } = req.files;

	const fileSize = process.env.MAX_FILE_SIZE;

	if (poster.size / (1024 * 1024) > fileSize || banner.size / (1024 * 1024) > fileSize) {
		return next(new CustomError(`Maximum image size is ${process.env.MAX_FILE_SIZE} MB`));
	}

	if (!poster || !banner) return next(new CustomError("Please upload poster and banner image", 400));

	genre = genre.split(",");
	language = language.split(",");
	actors = actors.split(",");

	const time = duration.split(":");
	duration = Number(time[0]) * 60 + Number(time[1]);

	let status = new Date(release_date) <= Date.now() ? "released" : "coming soon";

	console.log(status);
	console.log(new Date(release_date) <= Date.now());

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

// get all added movies
exports.getAllMovies = asyncHandler(async (req, res, next) => {
	let { sortBy, order, page, perPage } = req.query;

	sortBy = sortBy || "title";
	order = order || 1;
	page = page || 1;
	perPage = perPage || 5;

	const totalMovies = await Movie.countDocuments({ status: { $ne: "deleted" } });
	const releasedMovies = await Movie.countDocuments({ status: "released" });
	const comingSoonMovies = await Movie.countDocuments({ status: "coming soon" });

	const movies = await Movie.find({ status: { $ne: "deleted" } }, { title: 1, status: 1, release_date: 1 })
		.sort({
			[`${sortBy}`]: order,
		})
		.skip(page * parseInt(perPage))
		.limit(perPage);

	return res.status(200).json({
		status: "success",
		message: "movies list fetched",
		data: {
			totalMovies,
			releasedMovies,
			comingSoonMovies,
			movies,
		},
	});
});

// get all released movies
exports.getAllReleasedMovies = asyncHandler(async (req, res, next) => {
	const movies = await Movie.find({ status: "released" }, { title: 1 }).sort({
		release_date: 1,
	});

	return res.status(200).json({
		status: "success",
		message: "movies list fetched",
		data: {
			totalMovies: movies.length,
			movies,
		},
	});
});
