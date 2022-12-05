const sendError = (err, res) => {
	const { NODE_ENV } = process.env;

	let message = err.message;

	// if operational error don't expose to client
	if (err.statusCode === 500) {
		// log error message
		console.log("Error:", err.message);
		console.log("Error Stack: ", err.stack);
	}

	// development error
	if (NODE_ENV === "development") {
		return res.status(err.statusCode).json({
			status: "error",
			message,
			stack: err.stack,
		});
	}
	// production error, don't expose operational error to client
	else
		return res.status(err.statusCode).json({
			status: "error",
			message,
		});
};

const handleCastErrorDB = (err) => {
	err.statusCode = 500;
	if (process.env.NODE_ENV === "production") err.message = "something went wrong";
	else err.message = "Invalid Object ID";
	return err;
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	err.message = `Duplicate field value: ${value}`;
	return err;
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	err.message = `Invalid input data. ${errors.join(". ")}`;
	return err;
};

const handleTokenExpiredError = (err) => {
	err.statusCode = 400;
	err.message = "Your token has expired. Login again";
	return err;
};

module.exports = (err, req, res, next) => {
	// if operational error give 500 status code
	err.statusCode = err.statusCode || 500;

	if (err.name === "CastError") err = handleCastErrorDB(err);
	if (err.code === 11000) err = handleDuplicateFieldsDB(err);
	if (err.name === "ValidationError") err = handleValidationErrorDB(err);
	if (err.name === "TokenExpiredError") err = handleTokenExpiredError(err);

	sendError(err, res);
};
