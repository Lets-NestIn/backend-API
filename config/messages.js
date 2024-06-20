let messages;
module.exports = {
  error: {
    BadRequestValidation: {
      ok: false,
      code: 404,
      message: `${messages}`,
      data: null,
    },

    UNAUTHORIZED_ROLE: {
      ok: false,
      code: 403,
      message: "Forbidden - Insufficient role!",
    },

    emailConflict: {
      ok: false,
      code: 409,
      message: "This email is already used!",
    },
  },

  success: {
    PERMISSION_CREATED_SUCCESSFULLY: "Permission created successfully!",
    ROLE_CREATED_SUCCESSFULLY: "Role created successfully!",
    DELETE_PERMISSION_SUCCESS: "Permission deleted successfully!",
    DELETE_ROLE_SUCCESS: "Role deleted successfully!",

    ADD_RECIPIENT_SUCCESS: "Recipient added successfully!",
    URL_FETCHED_SUCCESSFULLY: "Url fetched successfully!",
    GET_RECIPIENT_SUCCESS: "Recipient fetched successfully!",
    UPDATE_RECIPIENT_SUCCESS: "Recipient updated successfully!",
    DELETE_RECIPIENT_SUCCESS: "Recipient deleted successfully!",
    GET_PERMISSION_SUCCESS: "Permission fetched successfully!",
    GET_ROLE_SUCCESS: "Role fetched successfully!",
    PASSWORD_CHANGED: "Password updated successfully!",
    PASSWORD_RESET_SUCCESSFULLY: "Password reset successfully!",

    ADD_COMPANY_SUCCESS:
      "Verification link sent successfully on your mail, Please verify your email!",
    GET_COMPANY_SUCCESS: "Company fetched successfully!",
    UPDATE_COMPANY_SUCCESS: "Company updated successfully!",
    DELETE_COMPANY_SUCCESS: "Company deleted successfully!",

    ADD_CUSTOMER_SUCCESS: "Customer registered successfully!",
    GET_CUSTOMER_SUCCESS: "Customer fetched successfully!",
    UPDATE_CUSTOMER_SUCCESS: "Customer updated successfully!",
    DELETE_CUSTOMER_SUCCESS: "Customer deleted successfully!",

    ADD_TAG_SUCCESS: "Tag added successfully!",
    GET_TAG_SUCCESS: "Tag fetched successfully!",
    UPDATE_TAG_SUCCESS: "Tag updated successfully!",
    DELETE_TAG_SUCCESS: "Tag deleted successfully!",

    VERIFIED_TOKEN: "Token Verified !",
    SENTOTP: "OTP sent successfully!",
    VERIFIED_OTP: "OTP verified successfully!",
    GET_USER_INFO: "User info fetched successfully!",
    RECIPIENT_EMAIL: "Recipient email fetched successfully!",
    PermissionAssigned: "Permission assigned to user successfully!",
    PermissionRemoved: "Permission removed to user successfully!",
    RoleAssigned: "Role assigned to user successfully!",
    RoleRemoved: "Role removed to user successfully!",
    LOGGED_OUT: "Logged out successfully!",
    UPDATED_SUCCESSFULLY: "Profile Updated successfully!",
  },
};
