require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cron = require("node-schedule");
const cors = require("cors");
const path = require("path");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const { NODE_ENV } = require("./config");

// security packages
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();

// middlewares to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS(cross site scripting)
app.use(xss());

// accept cross origin request
app.use(cors());

// cookies & file upload middlewares
app.use(cookieParser());
app.use(fileUpload());

// middleware for access frontend
const buildPath = path.normalize(path.join(__dirname, "/client/dist"));
app.use(express.static(buildPath));

// logger
if (NODE_ENV === "development") {
	app.use(morgan("dev"));
}

/**
 * application routes
 */

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const showRoute = require("./routes/show");
const movieRoute = require("./routes/movie");

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/shows", showRoute);
app.use("/api/movies", movieRoute);

// home route
app.get("/api", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "Welcome to movie buzz backend",
	});
});

// serve frontend
app.get("/", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

/**
 * cron job scheduling
 */

const { movieCron } = require("./utils/cron-jobs");

// run this function daily at 12:05 AM
cron.scheduleJob("5 12 * * *", movieCron);

// error handling
app.use(globalErrorHandler);

module.exports = app;
