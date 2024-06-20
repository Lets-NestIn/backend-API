const validator = require("../validator/userValidator");
const userHelper = require("../helper/userHelper");
const logger = require("loglevel");
const jwt_decoder = require("jwt-decode");
const messages = require("../config/messages");
const { Users } = require("../models/userModel");
const constant = require("../config/constant");
const message = require("../config/messages");

//Register User
const registerUser = async (req, res) => {
  try {
    const bodyData = req.body;
    await Users.validate(bodyData);
    let userInformations = await validator.validateRegisterUser(bodyData);
    userInformations.profileImage = req.files[0];
    const response = await userHelper.registerUserHelper(userInformations);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "User registered successfully",
      response,
      201
    );
  } catch (e) {
    logger.error("ERROR ::: register user ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const updateStatusByToken = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt_decoder.jwtDecode(token);
    const email = decoded.email;
    const response = await userHelper.updateStatusByTokenHelper(email);

    // Check if the update was successful before redirecting
    if (response) {
      return res.redirect(constant.SUCCESSFULL_REDIRECT_URL);
    } else {
      return _handleResponse(req, res, "Update status failed", null);
    }
  } catch (e) {
    logger.error("ERROR ::: update status by token ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const loginUser = async (req, res) => {
  try {
    let data = req.useragent;
    const bodyData = req.body;
    let userInformations = await validator.validateLoginUser(bodyData);
    userInformations.userAgent = data;
    const response = await userHelper.loginUserHelper(userInformations);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Please verify with 2FA to login successfully!",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: login user ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const sendOtp = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const response = await userHelper.sendOtpHelper(decoded);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      messages.success.SENTOTP,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: send otp ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const verifyOtp = async (req, res) => {
  try {
    let data = req.useragent;
    const bodyData = req.body;
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    let userInformations = await validator.validateVerifyOtp(bodyData);
    bodyData.mobile = decoded.mobile;
    userInformations.userAgent = data;
    const response = await userHelper.verifyOtpHelper(userInformations);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      messages.success.VERIFIED_OTP,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: verify otp ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const data = { userId: decoded.userId, reqUserId: req.params.userId };
    const response = await userHelper.getUserInfoHelper(data);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      messages.success.GET_USER_INFO,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get user info ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const QRcodegenerator = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const mobile = decoded.mobile;
    const response = await userHelper.QRcodegenerator(mobile);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Get QR code",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get user info ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let verifyQrCode = async (req, res) => {
  try {
    let data = req.useragent;
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userInformations = await validator.validateVerifyOtp(req.body);
    userInformations.mobile = decoded.mobile;
    userInformations.userAgent = data;
    const response = await userHelper.verifyQrCode(userInformations);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      messages.success.VERIFIED_OTP,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: verify otp using qr code ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const changePasswordHelper = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userInformations = await validator.validateChangePassword(req.body);
    userInformations.userId = decoded.userId;
    userInformations.reqUserId = req.params.userId;
    const response = await userHelper.changePasswordHelper(userInformations);
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: update password ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const forgetPassword = async (req, res) => {
  try {
    let options = await validator.validateForgetPassword(req.body);
    const response = await userHelper.forgotPassword(options);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Mail sent to Email",
      [],
      200
    );
  } catch (e) {
    logger.error("ERROR ::: Forget password ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const resetPassword = async (req, res) => {
  try {
    let options = await validator.validateResetPassword(req.body);
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userid = decoded.userId;
    options._id = userid;
    const response = await userHelper.resetPassword(options);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Password reset successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: Reset password ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const updateProfile = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userid = decoded.userId;
    let profileImage = req.files[0];
    let userInformations = await validator.validateUpdateProfile(req.body);
    userInformations._id = userid;
    userInformations.reqUserId = req.params.userId;
    const response = await userHelper.updateUserByUserId(
      userInformations,
      profileImage
    );
    return _handleResponseWithMessage(
      req,
      res,
      null,
      messages.success.UPDATED_SUCCESSFULLY,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: update profile ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let logoutUser = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userid = decoded.userId;
    let response = await userHelper.userLogout(userid);
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: logoutUser ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let generateNewTokens = async (req, res) => {
  try {
    let data = req.useragent;
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userid = decoded.userId;
    let response = await userHelper.generateNewTokens(userid, data);
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: generateNewTokens ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let getAllCompanySize = async (req, res) => {
  try {
    let response = await userHelper.getAllCompanySizeHelper();
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: getAllCompanySize ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let getAllTypeOfCompany = async (req, res) => {
  try {
    let response = await userHelper.getAllTypeOfCompany();
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: getAllTypeOfCompany ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let getAllCountry = async (req, res) => {
  try {
    let response = await userHelper.getAllCountry();
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: getAllCountry ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let getSignupRole = async (req, res) => {
  try {
    let response = await userHelper.getSignUpRole();
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: getSignupRole ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

let getAllUsers = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const { role, organization, gcId, email } =
      jwt_decoder.jwtDecode(tokenvalue);
    if (
      role === constant.ROLES_ENUM_VALUE.SUPER_ADMIN ||
      role === constant.ROLES_ENUM_VALUE.ADMIN ||
      role === constant.ROLES_ENUM_VALUE.MSSP ||
      role === constant.ROLES_ENUM_VALUE.MANAGER
    ) {
      let options = await validator.validateGetAllUsers(req.query);
      options.role = role;
      options.organization = organization;
      options.gcId = gcId;
      options.adminEmail = email;
      let response = await userHelper.getAllUsers(options);
      return _handleResponseWithMessage(
        req,
        res,
        null,
        messages.success.GET_USER_INFO,
        response,
        200
      );
    } else {
      throw messages.error.forbidden;
    }
  } catch (e) {
    logger.error("ERROR ::: getAllUsers ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getAllUsersForDashboard = async (req, res) => {
  try {
    let data = req.query;
    data.userInfo = req.decoded;
    const users = await userHelper.getAllUsersForDashboardHelper(data);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      message.success.GET_USER_INFO,
      users,
      200
    );
  } catch (e) {
    logger.error(
      "userController ::: ERROR ::: getAllUsersForDashboard ::: ",
      e
    );
    return _handleResponse(req, res, e, null);
  }
};

const userWithSubscriptions = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const { email, userId } = jwt_decoder.jwtDecode(tokenvalue);
    let options = await validator.validateUsersWithSbuscription(req.body);
    options.userId = req.params.userId;
    options.createdBy = email;
    options.updatedBy = email;
    options.event = req.method;
    options._id = userId;
    let response = await userHelper.assignSubscriptionToUser(options);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Subscription assigned successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: userWithSubscriptions ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getTokenByEmail = async (req, res) => {
  try {
    const response = await userHelper.getTokenByEmailHelper(req.body);
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: getTokenByEmail ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

module.exports = {
  registerUser,
  updateStatusByToken,
  loginUser,
  sendOtp,
  verifyOtp,
  getUserInfo,
  QRcodegenerator,
  verifyQrCode,
  changePasswordHelper,
  forgetPassword,
  resetPassword,
  logoutUser,
  updateProfile,
  getAllCountry,
  getAllCompanySize,
  getAllTypeOfCompany,
  getSignupRole,
  generateNewTokens,
  getAllUsers,
  userWithSubscriptions,
  getAllUsersForDashboard,
  getTokenByEmail,
};
