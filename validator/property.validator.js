const { Validator } = require("node-input-validator");
const message = require("../config/messages");
const constant = require("../config/constant");

module.exports = {
  validateProperty: async function (dataObj) {
    const v = new Validator(dataObj, {
      title: "string|maxLength:100",
      description: "string",
      address: "string",
      landmarks: "string",
      city: "string|required",
      state: "string|required",
      zipCode: "string|required",
      country: "string",
      propertyType: "string|required",
      price: "numeric|required|min:0",
      size: "numeric|required|min:0",
      bedrooms: "numeric|min:0",
      bathrooms: "numeric|min:0",
      balcony: "numeric|min:0",
      lift: "numeric|min:0",
      amenities: "array",
      images: "array",
      ownerId: "string",
      agentId: "string|required",
      status: "string",
      floor: "numeric|min:0",
      sellingFloor: "numeric|min:0",
      facing: "string",
      furnishing: "string",
      offer: "string",
      ownershipType: "string",
      overlooking: "string",
      ageOfConstruction: "string",
      waterAvailability: "string",
      electricityStatus: "string",
      authorityApproval: "string",
    });

    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },

  validateUpdateProperty: async function (dataObj) {
    const v = new Validator(dataObj, {
      title: "string|maxLength:100",
      description: "string",
      propertyType: "string",
      price: "numeric|min:0",
      size: "numeric|min:0",
      bedrooms: "numeric|min:0",
      bathrooms: "numeric|min:0",
      balcony: "numeric|min:0",
      lift: "numeric|min:0",
      amenities: "array",
      images: "array",
      agentId: "string",
      status: "string",
      floor: "numeric|min:0",
      sellingFloor: "numeric|min:0",
      facing: "string",
      furnishing: "string",
      offer: "string",
      ownershipType: "string",
      overlooking: "string",
      ageOfConstruction: "string",
      waterAvailability: "string",
      electricityStatus: "string",
      authorityApproval: "string",
    });

    const matched = await v.check();

    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },
  validateDeleteProperty: async function (params) {
    const v = new Validator(params, {
      _id: "required|string",
    });

    const matched = await v.check();

    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return params;
  },

  validateGetPropertyById: async function (params) {
    const v = new Validator(params, {
      _id: "required|string",
    });

    const matched = await v.check();

    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return params;
  },

  validateGetAllProperties: async function (queryParams) {
    const v = new Validator(queryParams, {
      pageNo: "numeric|min:1",
      pageSize: "numeric|min:1",
    });

    const matched = await v.check();

    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return queryParams;
  },

  validateCalcPrice: async function (queryParams) {
    const v = new Validator(queryParams, {
      initialPayment: "numeric|min:1",
      taxRate: "numeric|min:1",
      loanAmount: "numeric|min:1",
      loanTermYears: "numeric|min:1",
      interestRate: "numeric|min:1",
    });

    const matched = await v.check();

    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return queryParams;
  },
};
