const CustomError = require("../utils/customError");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authToken = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token;

	// if token unavailable send login again message
	if (!token) return next(new CustomError("Login again", 403));

	const decode = jwt.verify(token, process.env.JWT_SECRET);

	// token invalid or expired
	if (!decode) return next(new CustomError("Login again", 403));

	let user = await User.findOne({ _id: decode.id }).select("+role");

	if (!user) return next(new CustomError("Login again", 403));

	req.user = user;

	next();
});
