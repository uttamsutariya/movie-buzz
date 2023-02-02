const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const feedbackSchema = new Schema(
	{
		user: {
			type: SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			require: true,
			trim: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
