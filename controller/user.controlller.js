const dataValidator = require("../validator/user.validator");
const dbHelperUser = require("../helper/dbHelperUser");
const logger = require("loglevel");
const jwt_decoder = require("jwt-decode");
const message = require("../config/messages");

const registerUser = async (req, res) => {
  try {
    let options = await dataValidator.validateRegisterUser(req.body);
    options.images = req.files.filter(
      ({ fieldname }) => fieldname === "profilePicture"
    );

    const response = await dbHelperUser.registerUser(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "User  registered successfully",
      response,
      201
    );
  } catch (e) {
    logger.error("ERROR ::: register user ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const loginUser = async (req, res) => {
  try {
    let options = await dataValidator.validateLoginUser(req.body);
    const response = await dbHelperUser.userLogin(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "User logged in successfully",
      response,
      201
    );
  } catch (e) {
    logger.error("ERROR ::: login user ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const updateUser = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const userId = req.params._id;
    let options = await dataValidator.validateUpdateUser(req.body);
    options.tokenUserId = decoded.userId;
    options.role = decoded.role;
    options.images = req.files.filter(
      ({ fieldname }) => fieldname === "profilePicture"
    );

    const response = await dbHelperUser.updateUser(userId, options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "User updated in successfully",
      response,
      201
    );
  } catch (e) {
    logger.error("ERROR ::: update user ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const data = { userId: decoded.userId, reqUserId: req.params._id };
    const response = await dbHelperUser.getUserInfoHelper(data);
    return _handleResponseWithMessage(
      req,
      res,
      null,
      message.success.GET_USER_INFO,
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get user info ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const usersList = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const response = await dbHelperUser.usersList(decoded.role);
    return _handleResponseWithMessage(req, res, null, "Success", response, 200);
  } catch (e) {
    logger.error("ERROR ::: usersList ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUserInfo,
  usersList,
};
