const Movie = require("../models/movie");

// cron job for movies
exports.movieCron = async () => {
	// get all movie
	// for coming soon movies
	// check for each if today's date is greater than or equal its release date
	// if yes then update its status to released from coming soon

	try {
		const movies = await Movie.find({ status: "coming soon" });

		for (let movie of movies) {
			const isReleased = movie.release_date <= Date.now();

			if (isReleased) {
				movie.status = "released";
				await movie.save();
			}
		}

		console.log(`movie cron job ran at ${new Date().toUTCString()} successfully`);
	} catch (error) {
		console.log(`Error in movie cron job. Date: ${new Date().toUTCString()}`);
		console.log(error);
	}
};

/*
	*    *    *    *    *    *
	┬    ┬    ┬    ┬    ┬    ┬
	│    │    │    │    │    │
	│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
	│    │    │    │    └───── month (1 - 12)
	│    │    │    └────────── day of month (1 - 31)
	│    │    └─────────────── hour (0 - 23)
	│    └──────────────────── minute (0 - 59)
	└───────────────────────── second (0 - 59, OPTIONAL)
 */
