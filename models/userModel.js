const mongoose = require("mongoose");
const constant = require("../config/constant");
const message = require("../config/messages");

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minlength: [2, "FirstName must be at least 2 characters long!"],
    maxlength: [20, "FirstName cannot exceed 20 characters!"],
    validate: {
      validator: (value) => constant.REGEX.ONLY_ALPHABETS_REGEX.test(value),
      message: "FirstName should only contain alphabets!",
    },
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [2, "LastName must be at least 2 characters long!"],
    maxlength: [20, "LastName cannot exceed 20 characters!"],
    validate: {
      validator: (value) => {
        if (value) {
          return constant.REGEX.ONLY_ALPHABETS_REGEX.test(value);
        }
        return true;
      },
      message: "LastName should only contain alphabets!",
    },
    default: null,
  },

  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required!"],
    unique: true,
    validate: {
      validator: (value) => constant.REGEX.EMAIL_REGEX.test(value),
      message: "Please enter a valid email address!",
    },
  },

  tags: {
    type: Array,
    default: null,
  },

  organization: {
    type: String,
    default: null,
  },

  isArchive: {
    type: Boolean,
    default: false,
  },

  preferredLanguage: {
    type: String,
    trim: true,
    minlength: [2, "Preferred Language must be at least 2 characters long!"],
    maxlength: [20, "Preferred Language cannot exceed 20 characters!"],
    enum: {
      values: ["english", "ENGLISH", "English"],
      message:
        "Preferred Language must be either 'english', 'ENGLISH' or 'English'!",
    },
    validate: {
      validator: (value) => {
        if (value) {
          return constant.REGEX.ONLY_ALPHABETS_REGEX.test(value);
        }
        return true;
      },
      message: "Preferred Language should only contain alphabets!",
    },
  },

  websiteUrl: {
    type: String,
    minlength: [3, "Website Url must be at least 3 characters long!"],
  },

  password: {
    type: String,
    default: null,
    validate: {
      validator: (value) => {
        if (value) {
          return constant.REGEX.passwordRegex.test(value);
        }
        return true;
      },
      message: message.error.INVALID_PASSWORD,
    },
  },

  mobile: {
    type: String,
    required: [true, "Mobile is required!"],
    validate: {
      validator: function (value) {
        if (value) {
          return constant.REGEX.mobileRegex.test(value);
        } else {
          return true;
        }
      },
      message: message.error.INVALID_MOBILE,
    },
  },

  profileImageUrl: {
    type: String,
    default: null,
  },

  role: {
    type: String,
    default: null,
  },

  permission: {
    type: [],
    default: null,
  },

  secret: {
    type: String,
    default: null,
  },

  country: {
    type: String,
    default: null,
  },

  zipCode: {
    type: String,
    default: null,
    validate: {
      validator: (value) => {
        if (value) {
          return constant.REGEX.zipcodeRegex.test(value);
        }
        return true;
      },
      message: message.error.INVALID_ZIPCODE,
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isPaidUser: {
    type: Boolean,
    default: false,
  },

  subscriptions: {
    type: Object,
    default: {},
  },

  gcId: {
    type: String,
    default: null,
  },
  createdByEmail: {
    type: String,
    default: null,
  },

  isSubscribed: {
    type: Boolean,
    default: false,
  },

  isPaymentDone: {
    type: Boolean,
    default: false,
  },

  countryCode: {
    type: String,
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Users = mongoose.model(
  constant.COLLECTIONS.USERS_COLLECTION_NAME,
  usersSchema
);

module.exports = { Users };
