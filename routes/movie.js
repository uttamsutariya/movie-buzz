const router = require("express").Router();

// controllers
const { userGetAllMovies, getMovieById } = require("../controllers/movie");

// user get all movies
router.get("/", userGetAllMovies);

// user get movie details
router.get("/:movieId", getMovieById);

module.exports = router;
