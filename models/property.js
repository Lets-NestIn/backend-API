const mongoose = require("mongoose");
const constant = require("../config/constant");
const Schema = mongoose.Schema;

let propertySchema = new Schema({
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  landmarks: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  zipCode: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: "India",
  },
  propertyType: {
    type: String,
    default: null,
  },
  price: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: null,
  },
  bedrooms: {
    type: String,
    default: null,
  },
  bathrooms: {
    type: String,
    default: null,
  },
  balcony: {
    type: String,
    default: null,
  },
  lift: {
    type: String,
    default: null,
  },
  amenities: {
    type: Array,
    default: [],
  },
  images: {
    type: Array,
    default: [],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    default: "Available",
  },
  floor: {
    type: String,
    default: null,
  },
  sellingFloor: {
    type: String,
    default: null,
  },
  facing: {
    type: String,
    default: null,
  },
  furnishing: {
    type: String,
    default: null,
  },
  offer: {
    type: String,
    default: null,
  },
  priceBreakup: {
    price: String,
    registrationCharges: String,
  },
  loan: {
    emi: String,
    loanOffered: Boolean,
  },

  ownershipType: {
    type: String,
    default: null,
  },
  overlooking: {
    type: String,
    default: null,
  },
  ageOfConstruction: {
    type: String,
    default: null,
  },
  waterAvailability: {
    type: String,
    default: null,
  },
  electricityStatus: {
    type: String,
    default: null,
  },
  authorityApproval: {
    type: String,
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = {
  PropertyModel: mongoose.model("property", propertySchema),
};
