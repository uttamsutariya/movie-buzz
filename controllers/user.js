const crypto = require("crypto");
const asyncHandler = require("../middlewares/asyncHandler");
const { cookieToken } = require("../utils/cookieToken");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

const { FORGOT_PASSWORD_TOKEN_EXPIRY_MINUTE, BASE_URL, JWT_SECRET } = require("../config");

// mail sender
const { sendMail } = require("../helper/mailer");

// models
const User = require("../models/user");
const Feedback = require("../models/feedback");
const Booking = require("../models/booking");

// sign up
exports.signUp = asyncHandler(async (req, res, next) => {
	// distructure data from request body
	let { email, password } = req.body;

	if (!email || !password) {
		return next(new CustomError("Email & password are required", 400));
	}

	let user = await User.findOne({ email });

	if (user) {
		return next(new CustomError("User already exist", 400));
	}

	// create user
	user = await User.create({
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

	for (let booking of bookings) {
		if (booking.show.startTime < Date.now()) booking._doc.isExpired = true;
		else booking._doc.isExpired = false;
	}

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
	const expiry = Date.now() + FORGOT_PASSWORD_TOKEN_EXPIRY_MINUTE * 60 * 1000;

	await User.updateOne({ email }, { $set: { forgotPasswordToken: token, forgotPasswordTokenExpiry: expiry } });

	/**
	 * send mail to user
	 * form url =  http://{{url}}/#/user/reset-password/:userId/:token
	 * api url = http://{{url}}/api/user/resetPassword/:userId/:token
	 */

	const url = `${BASE_URL}/#/user/reset-password/${user._id}/${token}`;

	const mailDetails = {
		link: url,
	};

	sendMail(email, "Password reset", mailDetails, false);

	return res.status(200).json({
		status: "success",
		message: "Reset link set to your email, please check your inbox to continue",
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

	if (user.forgotPasswordTokenExpiry < Date.now()) return next(new CustomError("This link is expired 💥", 400));

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

// load user
exports.loadUser = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token;

	// if token unavailable send null user
	if (!token)
		return res.status(200).json({
			status: "success",
			data: {
				user: null,
			},
		});

	const decode = jwt.verify(token, JWT_SECRET);

	// token invalid or expired
	if (!decode) return next(new CustomError("Login again", 403));

	let user = await User.findOne({ _id: decode.id }).select("+role");

	// sending token in cookie
	cookieToken(user, res);
});

// logout user
exports.logout = asyncHandler(async (req, res, next) => {
	res.clearCookie("token");

	return res.status(200).json({
		status: "success",
		message: "Logout success",
		data: {},
	});
});
