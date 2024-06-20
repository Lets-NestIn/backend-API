const express = require("express");
const constant = require("../config/constant");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const userController = require("../controller/userController");

// const {
//   checkSignupToken,
//   checkToken,
//   check2faToken,
//   verifyRefreshToken,
//   checkForgetPasswordToken,
// } = require("../helper/tokenValidator");

router.post(constant.ENDPOINTS.USER, upload.any(), userController.registerUser);

module.exports = router;
