const AWS = require("aws-sdk");
const sharp = require("sharp");

const { AWS_ACCESS_KEY, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_SECRET_ACCESS_KEY } = require("../config");

const asyncHandler = require("../middlewares/asyncHandler");

const bucketName = AWS_BUCKET_NAME;
const bucketRegion = AWS_BUCKET_REGION;
const accessKey = AWS_ACCESS_KEY;
const secretAccessKey = AWS_SECRET_ACCESS_KEY;

AWS.config = new AWS.Config();
AWS.config.update({
	accessKeyId: accessKey,
	secretAccessKey,
	region: bucketRegion,
});

const s3 = new AWS.S3({
	accessKey,
	secretAccessKey,
});

exports.s3_upload = asyncHandler(async (file, folderName, banner = true) => {
	const imageName = file.name + "-" + Date.now();

	let buffer;

	if (banner) {
		// banner_image=944 * 472
		buffer = await sharp(file.data).resize({ height: 472, width: 944, fit: "contain" }).toBuffer();
	} else {
		// poster_image = 261 * 392 ;
		buffer = await sharp(file.data).resize({ height: 392, width: 261, fit: "contain" }).toBuffer();
	}

	const params = {
		Bucket: bucketName,
		Key: `${folderName}/${imageName}`,
		Body: buffer,
		ContentType: file.mimetype,
	};

	const uploadedImage = await s3.upload(params).promise();

	return uploadedImage.Location;
});
