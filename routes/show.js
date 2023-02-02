const router = require("express").Router();

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");

// controllers
const { getShowByMovie, getShowSeatsDetails } = require("../controllers/show");

// get show seats availability
router.get("/seats/:showId", authToken, getShowSeatsDetails);

// get show list by movie id
router.get("/:movieId", getShowByMovie);

module.exports = router;
