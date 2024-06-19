let express = require("express");
let router = express.Router();
const propertyController = require("../controller/property.controller");
const constant = require("../config/constant");
const multer = require("multer");

const uploads = multer();

router.post("/property", uploads.any(), propertyController.registerProperty);
router.get("/property", propertyController.getAllProperty);
router.get("/property/:_id", propertyController.getPropertyById);
router.delete("/property/:_id", propertyController.deletePropertyById);
router.put(
  "/property/:propertyId",
  uploads.any(),
  propertyController.updateProperty
);

module.exports = router;
