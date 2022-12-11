const router = require("express").Router();

// controllers
const {
	signUp,
	logIn,
	giveFeedback,
	getMyBookings,
	forgotPassword,
	resetPassword,
	loadUser,
	logout,
} = require("../controllers/user");
const { bookShow } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");

// sign up
router.post("/signup", signUp);

// login
router.post("/login", logIn);

// logout
router.get("/logout", logout);

// load user
router.get("/load", loadUser);

// book show
router.post("/bookShow", authToken, bookShow);

// give feedback
router.post("/feedback", authToken, giveFeedback);

// view my bookings
router.get("/bookings", authToken, getMyBookings);

// forgot password
router.post("/forgotPassword", forgotPassword);

// reset password
router.post("/resetPassword/:userId/:token", resetPassword);

module.exports = router;
