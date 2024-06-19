const credentials = require("../credentials.json");
module.exports = {
  PORT: credentials.PORT,

  MONGO_DB_URL: credentials.database,

  ALLOWED_ORIGINS: [
    "http://localhost:4006",
    "https://localhost:3000",
    "http://localhost:3000",
  ],
  COLLECTIONS: {
    PROPERTY_COLLECTION: "property",
  },
  AWS_CREDENTIALS: {
    ACCESS_KEY_ID: credentials.accessKeyId,
    SECRET_ACCESS_KEY: "b3xgn7pFBIFixEfDvHhxMFacOhdww950MmxLvolV",
    REGION: credentials.region,
    BUCKET: credentials.bucket,
    FILESIZE: credentials.fileSize,
  },

  BASE_URL: "/api/v1/realestate",
};
