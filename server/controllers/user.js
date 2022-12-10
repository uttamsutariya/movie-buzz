const crypto = require("crypto");
const asyncHandler = require("../middlewares/asyncHandler");
const { cookieToken } = require("../utils/cookieToken");
const CustomError = require("../utils/customError");

// mail sender
const { sendMail } = require("../helper/mailer");

// models
const User = require("../models/user");
const Feedback = require("../models/feedback");
const Booking = require("../models/booking");

// sign up
exports.signUp = asyncHandler(async (req, res, next) => {
	// distructure data from request body
	let { username, email, password } = req.body;

	if (!email || !password || !username) {
		return next(new CustomError("Username, email & password are required", 400));
	}

	let user = await User.findOne({ email });

	if (user) {
		return next(new CustomError("User already exist", 400));
	}

	// create user
	user = await User.create({
		username,
		email,
		password,
	});

	// sending token in cookie
	cookieToken(user, res);
});

// login
exports.logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// check if email & password present
	if (!email || !password) return next(new CustomError("Email and password are required", 400));

	// getting user from DB
	const user = await User.findOne({ email }).select("+password +role");

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

// give feedback
exports.giveFeedback = asyncHandler(async (req, res, next) => {
	const { message } = req.body;

	if (!message) return next(new CustomError("Please add feedback message"));

	const feedbackData = {
		message,
		user: req.user._id,
	};

	const feedback = await Feedback.create(feedbackData);

	return res.status(201).json({
		status: "success",
		message: "feedback added",
		data: {
			feedback,
		},
	});
});

// get my bookings
exports.getMyBookings = asyncHandler(async (req, res, next) => {
	const bookings = await Booking.find({ user: req.user._id }, { user: 0, updatedAt: 0 })
		.populate({
			path: "movie",
			model: "Movie",
			select: "title images",
		})
		.sort({ createdAt: -1 });

	return res.status(200).json({
		status: "success",
		message: "booking list fetched",
		data: {
			totalBookings: bookings.length,
			bookings,
		},
	});
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;

	if (!email) return next(new CustomError("Please enter email", 400));

	const user = await User.findOne({ email });

	if (!user) return next(new CustomError("User not found with this email", 400));

	const token = crypto.randomBytes(32).toString("hex");
	const expiry = Date.now() + process.env.FORGOT_PASSWORD_TOKEN_EXPIRY_MINUTE * 60 * 1000;

	await User.updateOne({ email }, { $set: { forgotPasswordToken: token, forgotPasswordTokenExpiry: expiry } });

	/**
	 * send mail to user
	 * http://{{url}}/api/user/resetPassword/:userId/:token
	 */

	const url = `${process.env.BASE_URL}/api/user/resetPassword/${user._id}/${token}`;

	sendMail(email, "Reset Your Password", url);

	return res.status(200).json({
		status: "success",
		message: "Password reset link sent on mail",
		data: {
			email,
			url,
		},
	});
});

// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const { token, userId } = req.params;

	if (!token || !userId) return next(new CustomError("Please provide token", 400));

	const user = await User.findOne({ _id: userId, token });

	if (!user) return next(new CustomError("Something went wrong, try again after sometime", 400));

	if (user.forgotPasswordTokenExpiry < Date.now()) return next(new CustomError("Link expired, try again", 400));

	const { password } = req.body;

	if (!password) return next(new CustomError("Please enter password", 400));

	user.password = password;

	await user.save();

	return res.status(200).json({
		status: "success",
		message: "password reset successfully",
		data: {},
	});
});
