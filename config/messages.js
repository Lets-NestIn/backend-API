let message;
module.exports = {
  error: {
    INVALID_ZIPCODE: "Invalid zipcode!",
    INVALID_MOBILE: "Invalid Mobile number!",
    INVALID_COLLECTION_NAME: "Invalid collection name!",
    INSERT_MONGODB:
      "mongoClient.insertDocumentWithIndex: document is not an object",
    VALIDATE_PASSWORD:
      "Password must contain at least 8 characters with uppercase, lowercase, digits, and symbols.",
    PASSWORD_CONFIRM_PASSWORD:
      "The password and confirm password fields must match.",
    TOO_MANY_OTP_REQUESTS:
      "You have exceeded the maximum OTP generation limit for the same mobile number. Please try logging in again after some times.",
    DEPARTMENT_REQUIRED: "Please provide department field.",
    EMAIL_REQUIRED: "Please provide email field",
    INVALID_FORMAT_OF_PROFILE_IMAGE:
      "Invalid File Format Of Profile::File must be jpeg/jpg or png",
    INVALID_SIZE_OF_PROFILE_IMAGE:
      "Invalid File Size Of Profile::Size must be less than 1mb",
    INVALID_OTP: "Wrong otp",
    INVALID_USER: "Invalid user!",
    INVALID_USER_ID: "Invalid user id!",
    INVALID_PAGE_NUMBER:
      "Invalid page number! It should be a positive number and greater than 0",
    INVALID_PAGE_SIZE:
      "Invalid page size! It should be a positive number and greater than 0",
    INVALID_COLLECTION_NAME: "Invalid collection name!",
    INVALID_ZONE_DIVISION: "Invalid zone or division",
    EMPLOYEEID_EXIST: "Employee ID already exists!",
    EMAIL_EXIST: "User already registered with this email!",
    MOBILE_EXIST: "User already registered with this mobile number!",
    MOBILE_ALREADY_REGISTERED: {
      ok: false,
      code: 409,
      message: "User has already registered",
      data: [],
    },
    AccessTokenISNULL: {
      ok: false,
      code: 401,
      message: "UnAuthorized",
    },
    RefreshTokenISNULL: {
      ok: false,
      code: 401,
      message: "UnAuthorized",
    },
    forbidden: {
      ok: false,
      code: 403,
      message: "You don't have access to this resource",
    },
    INVALID_TOKEN: {
      ok: false,
      code: 401,
      message: "Invalid token!",
    },
    USER_NOT_FOUND: {
      ok: false,
      code: 404,
      message: "User not found!",
    },
    INVALID_ADMIN: {
      ok: false,
      code: 403,
      message: "Invalid admin credentials!",
    },
    INCORRECT_PASSWORD: {
      ok: false,
      code: 401,
      message: "Incorrect password!",
    },
    USER_ALREADY_LOGGED_IN: {
      ok: false,
      code: 409,
      message: "User already logged in",
    },
    ALREADY_LOGGED_OUT: {
      ok: false,
      code: 409,
      message: "User already logged out!",
    },
    SOMETHING_WENT_WRONG: {
      ok: false,
      code: 500,
      message: "Something went wrong",
    },
    BadRequestValidation: {
      ok: false,
      code: 400,
      message: message,
    },
    INCORRECT_OLD_PASSWORD: {
      ok: false,
      code: 400,
      message: "Old password is wrong!",
    },
    SOMETHING_WENT_WRONG: {
      ok: false,
      code: 500,
      message: "Something went wrong",
    },
  },
  success: {
    VERIFIED_TOKEN: "Token Verified !",
    OTP_SENT: "Otp has been sent successfully",
    LOGGED_OUT: "Logged out successfully!",
    RESET_PASSWORD_LINK: "Reset Password Link Sent Successfully",
    PASSWORD_RESET_SUCCESSFULLY: "Password Reset Successfully",
    GET_USER_INFO: "User info fetched successfully!",
    USER_VERIFIED: "User verified successfully!",
    FIREBASE_TOKEN_UPDATED: "Firebase token updated successfully!",
    GROUP_CREATED_SUCCESSFULLY: "Group Created Successfully",
  },
};
