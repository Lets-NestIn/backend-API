const mongoose = require("mongoose");
const constant = require("../config/constant");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "AGENT", "SELLER", "ADMIN"],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  profilePicture: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  agentLicenseNumber: {
    type: String,
    required: function () {
      return this.role === "AGENT";
    },
  },
  agencyName: {
    type: String,
    required: function () {
      return this.role === "AGENT";
    },
  },

  favouritePropertiesId: {
    type: Array,
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = {
  UserModel: mongoose.model("user", userSchema),
};
