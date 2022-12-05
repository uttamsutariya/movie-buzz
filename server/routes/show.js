const router = require("express").Router();

// controllers
const { getShowByMovie, getShowSeatsDetails } = require("../controllers/show");

// get show seats availability
router.get("/seats/:showId", getShowSeatsDetails);

// get show list by movie id
router.get("/:movieId", getShowByMovie);

module.exports = router;
