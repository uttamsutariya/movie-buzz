const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			lowercase: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: [false, "password is required"],
		},
		role: {
			type: Number,
			default: 0,
			select: false,
			// 0 => normal user
			// 1 => application admin (cinema)
		},
		forgotPasswordToken: String,
		forgotPasswordTokenExpiry: Date,
	},
	{ timestamps: true, versionKey: false }
);

// Encrypt password before save
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 8);
});

// check for password validation in login
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
	return await bcrypt.compare(userSendPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
