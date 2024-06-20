const { DbHelper } = require("./dbHelper");
const dbInstance = new DbHelper();
const { COLLECTIONS } = require("../config/constant");
const logger = require("loglevel");
const message = require("../config/messages");
const constant = require("../config/constant");
const { fileUpload, invokeLambda } = require("../helper/helperFunction");
const { default: mongoose } = require("mongoose");

const registerProperty = async (options) => {
  try {
    if (options.role !== "ADMIN" && options.role !== "SELLER") {
      throw message.error.forbidden;
    }

    let imagesData;
    if (options.images) {
      imagesData = await fileUpload(options.images);
    }

    const propertyObj = {
      title: options.title,
      description: options.description,
      address: options.address,
      landmarks: options.landmarks,
      city: options.city,
      state: options.state,
      zipCode: options.zipCode,
      country: options.country,
      propertyType: options.propertyType,
      price: options.price,
      size: options.size,
      bedrooms: options.bedrooms,
      bathrooms: options.bathrooms,
      balcony: options.balcony,
      lift: options.lift,
      amenities: options.amenities,
      images: imagesData,
      agentId: options.agentId,
      ownerId: options.userId,
      status: options.status,
      floor: options.floor,
      sellingFloor: options.sellingFloor,
      facing: options.facing,
      furnishing: options.furnishing,
      offer: options.offer,
      priceBreakup: {
        price: options.priceBreakup?.price,
        registrationCharges: options.priceBreakup?.registrationCharges,
      },
      loan: {
        emi: options.loan?.emi,
        loanOffered: options.loan?.loanOffered || false,
      },
      ownershipType: options.ownershipType,
      overlooking: options.overlooking,
      ageOfConstruction: options.ageOfConstruction,
      waterAvailability: options.waterAvailability,
      electricityStatus: options.electricityStatus,
      authorityApproval: options.authorityApproval,
    };

    // Insert property into database
    const property = await dbInstance.insertDocument(
      COLLECTIONS.PROPERTY_COLLECTION,
      propertyObj
    );

    return property;
  } catch (error) {
    logger.error("dbHelperProperty ::::: registerProperty", error);
    throw error;
  }
};

const getPropertyById = async (propertyId) => {
  try {
    const property = await dbInstance.getDocumentByQuery(
      COLLECTIONS.PROPERTY_COLLECTION,
      {
        _id: propertyId,
      }
    );

    if (!property) {
      throw new Error("Property not found");
    }
    return property;
  } catch (e) {
    logger.error(`dbHelperProperty ------> getPropertyById: ${propertyId}`, e);
    throw e;
  }
};

const getAllProperty = async (propertyId) => {
  try {
    const property = await dbInstance.findall(COLLECTIONS.PROPERTY_COLLECTION);

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  } catch (e) {
    logger.error(`dbHelperProperty ------> getALL: ${propertyId}`, e);
    throw e;
  }
};

const deleteProperty = async (options) => {
  try {
    let deletedProperty;

    if (options.role === "ADMIN") {
      deletedProperty = await dbInstance.deleteDocumentByQuery(
        COLLECTIONS.PROPERTY_COLLECTION,
        { _id: new mongoose.Types.ObjectId(options._id) }
      );
    } else if (options.role === "SELLER") {
      deletedProperty = await dbInstance.deleteDocumentByQuery(
        COLLECTIONS.PROPERTY_COLLECTION,
        {
          _id: new mongoose.Types.ObjectId(options._id),
          ownerId: new mongoose.Types.ObjectId(options.userId),
        }
      );
    } else {
      throw new Error("Property not found");
    }

    return deletedProperty;
  } catch (e) {
    logger.error(`dbHelperProperty ------> deleteProperty: ${propertyId}`, e);
    throw e;
  }
};

const updateProperty = async (propertyId, options) => {
  try {
    let imagesData;

    if (options.images) {
      imagesData = await fileUpload(options.images);
    }

    const propertyObj = {
      title: options.title,
      description: options.description,
      address: options.address,
      landmarks: options.landmarks,
      city: options.city,
      state: options.state,
      zipCode: options.zipCode,
      country: options.country,
      propertyType: options.propertyType,
      price: options.price,
      size: options.size,
      bedrooms: options.bedrooms,
      bathrooms: options.bathrooms,
      balcony: options.balcony,
      lift: options.lift,
      amenities: options.amenities,
      images: imagesData,
      agentId: options.agentId,
      status: options.status,
      floor: options.floor,
      sellingFloor: options.sellingFloor,
      facing: options.facing,
      furnishing: options.furnishing,
      offer: options.offer,
      priceBreakup: {
        price: options.priceBreakup?.price,
        registrationCharges: options.priceBreakup?.registrationCharges,
      },
      loan: {
        emi: options.loan?.emi,
        loanOffered: options.loan?.loanOffered || false,
      },
      ownershipType: options.ownershipType,
      overlooking: options.overlooking,
      ageOfConstruction: options.ageOfConstruction,
      waterAvailability: options.waterAvailability,
      electricityStatus: options.electricityStatus,
      authorityApproval: options.authorityApproval,
    };
    const response = await dbInstance.updateDocument(
      COLLECTIONS.PROPERTY_COLLECTION,
      { _id: propertyId },
      propertyObj
    );

    const userInfo = await dbInstance.getUsersByPropertyId(
      COLLECTIONS.USER_COLLECTION,
      // { _id: new mongoose.Types.ObjectId(propertyId) }
      propertyId
    );

    const userEmail = userInfo.map((data) => data.email);

    const eventPayload = {
      body: JSON.stringify({
        recipientEmails: userEmail,
        updatedFields: propertyObj,
      }),
    };
    await invokeLambda(eventPayload);

    if (!response) {
      throw new Error("Property not found");
    }

    return response;
  } catch (e) {
    logger.error("dbHelperProperty ::::: updateProperty", e);
    throw e;
  }
};

module.exports = {
  registerProperty,
  getPropertyById,
  deleteProperty,
  getAllProperty,
  updateProperty,
};
