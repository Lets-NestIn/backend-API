const { Validator } = require("node-input-validator");
const messages = require("../config/messages");

module.exports = {
  validateRegisterUser: async function (dataObj) {
    const v = new Validator(dataObj, {
      firstName: "required|string|minLength:3",

      lastName: "string|minLength:3",
      mobile: "string|required",
      role: "string",
      email: "string|required",
      country: "string|required",
      zipCode: "string",
      password: "string|required",
      confirmPassword: "string|required",
      countryCode: "string|required",
    });

    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },

  validateLoginUser: async function (dataObj) {
    const v = new Validator(dataObj, {
      email: "string|required",
      password: "string|required",
    });

    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },
};
