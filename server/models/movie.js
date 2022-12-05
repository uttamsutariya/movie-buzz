const mongoose = require("mongoose");

const { Schema } = mongoose;

const movieSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Provide movie name"],
		},
		language: {
			type: [String],
			required: [true, "Provide language of movie"],
		},
		description: {
			type: String,
			required: [true, "Provide movie description"],
		},
		release_date: {
			type: Date,
			required: [true, "Provide movie releaseDate"],
		},
		trailer_link: {
			type: String,
			required: [true, "Provide movie trailer link"],
			// link required
		},
		images: {
			poster: {
				type: String,
				required: [true, "Provide movie poster"],
				// vertical poster type image
			},
			banner: {
				type: String,
				required: [true, "Provide movie banner"],
				// horizontal banner type image
			},
		},
		duration: {
			type: Number,
			required: true,
			// stored as minutes
		},
		genre: [String],
		actors: [String],
		adult: {
			type: Boolean,
			required: true,
			default: false,
		},
		status: {
			type: String,
			required: true,
			default: "coming soon",
			enum: ["released", "coming soon", "deleted"],
		},
	},
	{ timestamps: true, versionKey: false }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
