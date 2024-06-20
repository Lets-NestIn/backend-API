const credentials = require("../credentials.json");
module.exports = {
  PORT: credentials.PORT,

  MONGO_DB_URL: credentials.database,
  DEPLOYED_REDIS_HOST: credentials.DEPLOYED_REDIS_HOST,
  DEPLOYED_REDIS_PORT: credentials.DEPLOYED_REDIS_PORT,
  DEPLOYED_REDIS_PASSWORD: credentials.DEPLOYED_REDIS_PASSWORD,
  ACCESSTOKENSECRETKEY: credentials.ACCESSTOKENSECRETKEY,
  REFRESHTOKENSECRETKEY: credentials.REFRESHTOKENSECRETKEY,
  CACHESECRETKEY: "secretkey",

  ALLOWED_ORIGINS: [
    "http://localhost:4006",
    "https://localhost:3000",
    "http://localhost:3000",
  ],
  COLLECTIONS: {
    PROPERTY_COLLECTION: "property",
    USER_COLLECTION: "user",
  },
  AWS_CREDENTIALS: {
    ACCESS_KEY_ID: credentials.accessKeyId,
    SECRET_ACCESS_KEY: credentials.secretAccessKey,
    REGION: credentials.region,
    BUCKET: credentials.bucket,
    FILESIZE: credentials.fileSize,
  },
  ALLOWED_FILE_SIZE_FOR_USER_PROFILE: 1 * 1024 * 1024, //1mb
  ALLOWED_FILE_TYPE_FOR_USER_PROFILE: ["image/jpeg", "image/png", "image/jpg"],
  REGEX: {
    zipcodeRegex: /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
    mobileRegex: /^\d{10}$/,
    objectId: /^[0-9a-fA-F]{24}$/,
    email:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  BASE_URL: "/api/v1/realestate",
};
