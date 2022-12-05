const router = require("express").Router();

// controllers
const { signUp, logIn, giveFeedback, getMyBookings, forgotPassword, resetPassword } = require("../controllers/user");
const { bookShow } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// sign up
router.post("/signup", signUp);

// login
router.post("/login", logIn);

// book show
router.post("/bookShow", authToken, authorizeRole(0), bookShow);

// give feedback
router.post("/feedback", authToken, authorizeRole(0), giveFeedback);

// view my bookings
router.get("/bookings", authToken, authorizeRole(0), getMyBookings);

// forgot password
router.post("/forgotPassword", forgotPassword);

// reset password
router.post("/resetPassword/:userId/:token", resetPassword);

module.exports = router;
