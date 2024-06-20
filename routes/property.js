let express = require("express");
let router = express.Router();
const propertyController = require("../controller/property.controller");
const constant = require("../config/constant");
const multer = require("multer");
const { checkToken } = require("../middleware/middleware");

const uploads = multer();

router.post(
  "/property",
  checkToken,
  uploads.any(),
  propertyController.registerProperty
);
router.get("/property", propertyController.getAllProperty);
router.get("/property/:_id", propertyController.getPropertyById);
router.get(
  "/wishlistproperty/:_id",
  propertyController.getWishlistPropertyById
);
router.delete(
  "/property/:_id",
  checkToken,
  propertyController.deletePropertyById
);
router.put(
  "/property/:propertyId",
  checkToken,
  uploads.any(),
  propertyController.updateProperty
);

module.exports = router;
