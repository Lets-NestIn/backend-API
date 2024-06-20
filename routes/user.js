let express = require("express");
let router = express.Router();
const userController = require("../controller/user.controlller");
const constant = require("../config/constant");
const multer = require("multer");
const { checkToken, verifyAccessToken } = require("../middleware/middleware");

const uploads = multer();

router.post("/register", uploads.any(), userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/checktoken", verifyAccessToken);
// router.get("/user/:_id", userController.getUserById);

router.put("/user/:_id", checkToken, uploads.any(), userController.updateUser);

module.exports = router;
