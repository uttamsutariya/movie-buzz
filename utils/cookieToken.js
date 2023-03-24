const jwt = require("jsonwebtoken");

const { COOKIE_EXPIRE_DAYS, JWT_SECRET, JWT_EXPIRY } = require("../config");

// setting cookie options
const options = {
	expires: new Date(Date.now() + COOKIE_EXPIRE_DAYS * 20 * 60 * 60 * 1000),
	httpOnly: true,
};

exports.cookieToken = (user, res) => {
	const token = jwt.sign({ id: user._id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRY,
	});

	user._doc.password = undefined;
	user._doc.createdAt = undefined;
	user._doc.updatedAt = undefined;
	user._doc.token = token;

	// sending token as a cookie in response
	res.status(201).cookie("token", token, options).json({
		status: "success",
		data: { user },
	});
};
