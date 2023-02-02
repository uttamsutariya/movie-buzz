const CustomError = require("../utils/customError");

exports.authorizeRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new CustomError("You are not allowed for this resource", 400));
		}
		next();
	};
};
