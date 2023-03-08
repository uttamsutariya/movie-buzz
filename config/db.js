const mongoose = require("mongoose");

const { DB_URL } = process.env;

exports.connect = () => {
	mongoose.set("strictQuery", true);
	mongoose
		.connect(DB_URL)
		.then((res) => console.log(`Db connected on: ${res.connection.host}:${res.connection.port}`))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});
};
