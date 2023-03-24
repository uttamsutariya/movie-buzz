const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const { MAIL_HOST, MAIL_PORT, MAIL_AUTH_CREDENTIAL_PASSWORD, MAIL_AUTH_CREDENTIAL_USER } = require("../config");

let transporter = nodemailer.createTransport({
	host: MAIL_HOST,
	port: MAIL_PORT,
	secure: false,
	requireTLS: true,
	auth: {
		user: MAIL_AUTH_CREDENTIAL_USER,
		pass: MAIL_AUTH_CREDENTIAL_PASSWORD,
	},
});

const handlebarsOptions = {
	viewEngine: {
		extName: ".hbs",
		partialDir: path.join(__dirname, "../views"),
		defaultLayout: false,
	},
	viewPath: path.join(__dirname, "../views"),
	extName: ".hbs",
};

transporter.use("compile", hbs(handlebarsOptions));

exports.sendMail = async (reciever, sub, mailDetails, isTicketMail = true) => {
	let mailOptions = {
		from: MAIL_AUTH_CREDENTIAL_USER,
		to: reciever,
		subject: sub,
		template: isTicketMail ? "email" : "reset-password",
		context: {
			...mailDetails,
		},
	};

	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Mail sent to: " + reciever);
		}
	});
};
