const router = require("express").Router();

// contgrollers
const {
	addCinemaHall,
	viewFeedback,
	getAllShowsAndAnalytics,
	getShowDetails,
	getCinemaHalls,
	populateShowForm,
} = require("../controllers/admin");

const { addMovie, deleteMovie, getAllMovies, getAllReleasedMovies } = require("../controllers/movie");

const { addNewShow, updateShowDetails } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// add new movie
router.post("/movies", authToken, authorizeRole(1), addMovie);

// get all movies
router.get("/movies", authToken, authorizeRole(1), getAllMovies);

// get all released movies for show form select option
router.get("/released-movies", authToken, authorizeRole(1), getAllReleasedMovies);

// delete movie
router.delete("/movies/:movieId", authToken, authorizeRole(1), deleteMovie);

// add new cinema hall
router.post("/cinemaHall", authToken, authorizeRole(1), addCinemaHall);

// get all cinema hall
router.get("/cinemaHall", authToken, authorizeRole(1), getCinemaHalls);

// add new show
router.post("/show", authToken, authorizeRole(1), addNewShow);

// update show
router.patch("/show/:showId", authToken, authorizeRole(1), updateShowDetails);

// get all added shows
router.get("/shows", authToken, authorizeRole(1), getAllShowsAndAnalytics);

// populate show form with defaut values
router.get("/shows/populate/:showId", authToken, authorizeRole(1), populateShowForm);

// get details of show
router.get("/shows/:showId", authToken, authorizeRole(1), getShowDetails);

// view all feedbacks
router.get("/feedback", authToken, authorizeRole(1), viewFeedback);

module.exports = router;
