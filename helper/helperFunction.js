const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const logger = require("loglevel");
const constant = require("../config/constant");

const fileUpload = async (images) => {
  try {
    const uploadedLocations = [];

    const s3 = new AWS.S3({
      accessKeyId: constant.AWS_CREDENTIALS.ACCESS_KEY_ID,
      secretAccessKey: constant.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
    });

    if (images && Array.isArray(images)) {
      for (let image of images) {
        if (!image) continue; // Skip if image is undefined or null

        let splitted = image.mimetype.split("/");
        let fileType = splitted[1];

        const updatedImageData = {
          ...image,
          buffer: Buffer.from(image.buffer),
        };

        const myFile = image.originalname.split(".");
        const params = {
          Bucket: constant.AWS_CREDENTIALS.BUCKET,
          Key: `${myFile}.${fileType}`,
          Body: updatedImageData.buffer,
          ContentDisposition: "inline",
        };

        const uploadPromise = new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              logger.warn("Error uploading to S3:", err);
              reject(err);
              return;
            }
            logger.info("S3 upload successful. Location:", data.Location);
            resolve(data.Location);
          });
        });

        const location = await uploadPromise;
        uploadedLocations.push(location);
      }

      return uploadedLocations;
    }
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = {
  fileUpload,
};
