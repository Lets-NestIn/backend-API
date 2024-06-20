const credentials = require("../credentials.json");
module.exports = {
  PORT: credentials.PORT,

  MONGO_DB_URL: credentials.database,

  ALLOWED_ORIGINS: [
    "http://localhost:4006",
    "https://localhost:3000",
    "http://localhost:3000",
  ],

  BASE_URL: "/realestate",
  ENDPOINTS: {
    BASEURL: "/realestate/api/v1",
    CHECKACCESSTOKEN: "/accesstoken",
    CHECKSIGNUPTOKEN: "/signuptoken",
    CHECK2FATOKEN: "/2fatoken",
    CHECKFORGETTOKEN: "/forgettoken",
    CHECKREFRESHTOKEN: "/refreshtoken",
    USER: "/user",
  },

  REGEX: {
    EMAIL_REGEX: /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    ONLY_DOMIN: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    ONLY_ALPHABETS_REGEX: /^[a-zA-Z ]*$/,

    ORGANIZATION_NAME_REGEX:
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,

    TAG_NAME_REGEX: /^[a-zA-Z]+[a-zA-Z\-_:()]*$/,
    passwordRegex:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,

    mobileRegex: /^\+?[0-9\s.-]+$/,

    countryCodeRegex: /^\+\d+$/,

    zipcodeRegex: /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,

    stringOnlyRegex: /^[a-zA-Z\s]+$/,

    stringregex: /^[a-zA-Z]{1,20}$/,

    notNull: /^.+$/,

    fileName: /^[a-zA-Z0-9.-]+$/,
    emailIdValidation:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    timeFormatValidation:
      /^(([0-9]{1})|([0-1]{1}[0-9]{1})|([2]{1}[0-3]{1}))([:]{1})([0-5]{1}[0-9]{1})$/,
  },

  COLLECTIONS: {
    USERS_COLLECTION_NAME: "users",
  },
};
