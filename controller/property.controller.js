const dataValidator = require("../validator/property.validator");
const dbHelperProperty = require("../helper/dbHelperProperty");
const logger = require("loglevel");
const jwt_decoder = require("jwt-decode");
const message = require("../config/messages");

const registerProperty = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    let options = await dataValidator.validateProperty(req.body);
    options.userId = decoded.userId;
    options.role = decoded.role;
    options.images = req.files.filter(
      ({ fieldname }) => fieldname === "images"
    );

    const response = await dbHelperProperty.registerProperty(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Property has been registered successfully",
      response,
      201
    );
  } catch (e) {
    logger.error("ERROR ::: register property ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getAllProperty = async (req, res) => {
  try {
    let options = await dataValidator.validateGetAllProperties(req.query);
    const response = await dbHelperProperty.getAllProperty(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Properties fetched successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get all property ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const getPropertyById = async (req, res) => {
  try {
    let options = await dataValidator.validateGetPropertyById(req.params);
    const response = await dbHelperProperty.getPropertyById(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Properties fetched successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get all property ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const deletePropertyById = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    let options = await dataValidator.validateDeleteProperty(req.params);
    options.userId = decoded.userId;
    options.role = decoded.role;
    const response = await dbHelperProperty.deleteProperty(options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Properties deleted successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: get all property ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

const updateProperty = async (req, res) => {
  try {
    const tokenvalue = req.header("Authorization");
    const decoded = jwt_decoder.jwtDecode(tokenvalue);
    const propertyId = req.params.propertyId;
    let options = await dataValidator.validateUpdateProperty(req.body);
    options.userId = decoded.userId;
    options.role = decoded.role;
    options.images = req.files.filter(
      ({ fieldname }) => fieldname === "images"
    );

    const response = await dbHelperProperty.updateProperty(propertyId, options);

    return _handleResponseWithMessage(
      req,
      res,
      null,
      "Property has been updated successfully",
      response,
      200
    );
  } catch (e) {
    logger.error("ERROR ::: update property ::: ", e);
    return _handleResponse(req, res, e, null);
  }
};

module.exports = {
  registerProperty,
  getAllProperty,
  getPropertyById,
  deletePropertyById,
  updateProperty,
};
