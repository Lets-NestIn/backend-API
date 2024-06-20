const { Validator } = require("node-input-validator");
const message = require("../config/messages");
const constant = require("../config/constant");
const { isPasswordStrong } = require("../helper/helperFunction");

module.exports = {
  validateRegisterUser: async function (dataObj) {
    const v = new Validator(dataObj, {
      email: "email|required",
      password: "string|required|minLength:6",
      role: "string|required",
      firstName: "string|required|maxLength:30",
      lastName: "string|required|maxLength:30",
      phoneNumber: "numeric|required",
      isActive: "boolean",
    });

    v.addPostRule((provider) => {
      const { phoneNumber } = provider.inputs;

      if (phoneNumber && !constant.REGEX.mobileRegex.test(phoneNumber)) {
        throw new Error(message.error.INVALID_MOBILE);
      }
    });

    const matched = await v.check();

    if (!matched) {
      throw new Error(Object.values(v.errors)[0].message);
    }

    return dataObj;
  },

  validateUpdateUser: async function (dataObj) {
    const v = new Validator(dataObj, {
      firstName: "string|maxLength:30",
      lastName: "string|maxLength:30",
      phoneNumber: "numeric",
      favouritePropertiesId: "array",
    });

    v.addPostRule((provider) => {
      const { phoneNumber } = provider.inputs;

      if (phoneNumber && !constant.REGEX.mobileRegex.test(phoneNumber)) {
        throw new Error(message.error.INVALID_MOBILE);
      }
    });

    const matched = await v.check();

    if (!matched) {
      throw new Error(Object.values(v.errors)[0].message);
    }

    return dataObj;
  },

  validateLoginUser: async function (dataObj) {
    const v = new Validator(dataObj, {
      email: "email|required",
      password: "string|required",
    });

    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },

  validateUserId: async function (dataObj) {
    const v = new Validator(dataObj, {
      userId: "string|required",
    });
    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }
    return dataObj;
  },

  validateForgetPassword: async function (dataObj) {
    const v = new Validator(dataObj, {
      email: "email|required",
    });
    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },

  validateResetPassword: async function (dataObj) {
    const v = new Validator(dataObj, {
      newPassword: "string|required",
      confirmPassword: "string|required",
    });

    v.addPostRule((provider) => {
      const { newPassword, confirmPassword } = provider.validationRules;

      const isPasswordValid = newPassword.value
        ? isPasswordStrong(newPassword.value)
        : true;
      const doPasswordsMatch = newPassword.value === confirmPassword.value;
      !isPasswordValid
        ? (() => {
            throw message.error.VALIDATE_PASSWORD;
          })()
        : null;

      !doPasswordsMatch
        ? (() => {
            throw message.error.PASSWORD_CONFIRM_PASSWORD;
          })()
        : null;
    });
    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }
    return dataObj;
  },

  validateChangePassword: async function (dataObj) {
    const v = new Validator(dataObj, {
      oldPassword: "string|required",
      newPassword: "string|required",
      confirmPassword: "string|required",
    });

    v.addPostRule((provider) => {
      const { newPassword, confirmPassword } = provider.validationRules;

      const isPasswordValid = newPassword.value
        ? isPasswordStrong(newPassword.value)
        : true;
      const doPasswordsMatch = newPassword.value === confirmPassword.value;
      !isPasswordValid
        ? (() => {
            throw message.error.VALIDATE_PASSWORD;
          })()
        : null;

      !doPasswordsMatch
        ? (() => {
            throw message.error.PASSWORD_CONFIRM_PASSWORD;
          })()
        : null;
    });
    const matched = await v.check();
    if (!matched) {
      throw Object.values(v.errors)[0].message;
    }

    return dataObj;
  },
};
