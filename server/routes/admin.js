const router = require("express").Router();

// contgrollers
const {
	logIn,
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

// login
router.post("/login", logIn);

// add new movie
// router.post("/movies", authToken, authorizeRole(1), addMovie);
router.post("/movies", addMovie);

// get all movies
// router.get("/movie", authToken, authorizeRole(1), getAllMovies);
router.get("/movies", getAllMovies);

// get all released movies for show form select option
// router.get("/movie", authToken, authorizeRole(1), getAllReleasedMovies);
router.get("/released-movies", getAllReleasedMovies);

// delete movie
// router.delete("/movies/:movieId", authToken, authorizeRole(1), deleteMovie);
router.delete("/movies/:movieId", deleteMovie);

// add new cinema hall
// router.post("/cinemaHall", authToken, authorizeRole(1), addCinemaHall);
router.post("/cinemaHall", addCinemaHall);

// get all cinema hall
// router.get("/cinemaHall", authToken, authorizeRole(1), getCinemaHalls);
router.get("/cinemaHall", getCinemaHalls);

// add new show
// router.post("/show", authToken, authorizeRole(1), addNewShow);
router.post("/show", addNewShow);

// update show
// router.patch("/show", authToken, authorizeRole(1), updateShowDetails);
router.patch("/show/:showId", updateShowDetails);

// get all added shows
// router.get("/shows", authToken, authorizeRole(1), getAllShowsAndAnalytics);
router.get("/shows", getAllShowsAndAnalytics);

// populate show form with defaut values
// router.get("/shows/populate/:showId", authToken, authorizeRole(1), populateShowForm);
router.get("/shows/populate/:showId", populateShowForm);

// get details of show
// router.get("/shows/:showId", authToken, authorizeRole(1), getShowDetails);
router.get("/shows/:showId", getShowDetails);

// view all feedbacks
// router.get("/feedback", authToken, authorizeRole(1), viewFeedback);
router.get("/feedback", viewFeedback);

module.exports = router;
