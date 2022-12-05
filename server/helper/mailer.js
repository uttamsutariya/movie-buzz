const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: false,
	requireTLS: true,
	auth: {
		user: process.env.MAIL_AUTH_CREDENTIAL_USER,
		pass: process.env.MAIL_AUTH_CREDENTIAL_PASSWORD,
	},
});
exports.sendMail = async (reciever, sub, message) => {
	let mailOptions = {
		from: process.env.MAIL_AUTH_CREDENTIAL_USER,
		to: reciever,
		subject: sub,
		text: message,
	};

	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Mail sent to: " + reciever);
		}
	});
};
