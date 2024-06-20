const { DbHelper } = require("./dbHelper");
const dbInstance = new DbHelper();
const mongoose = require("mongoose");
const logger = require("loglevel");
const { COLLECTIONS } = require("../config/constant");
const constant = require("../config/constant");
const encryptPassword = require("../helper/helperFunction");
const messages = require("../config/messages");

const registerUserHelper = async (registerUserData) => {
  try {
    console.log("registerUserData==========>", registerUserData);
    await dbInstance.connect();

    const emailAlreadyExist = await dbInstance.getDocumentByObj(
      COLLECTIONS.USERS_COLLECTION_NAME,
      { email: registerUserData.email }
    );
    console.log("+++++++++++++++");
    const mobileAlreadyExist = await dbInstance.getDocumentByObj(
      COLLECTIONS.USERS_COLLECTION_NAME,
      { mobile: registerUserData.mobile }
    );
    console.log("__________________");
    const checkValidPassword = constant.REGEX.passwordRegex.test(
      registerUserData.password
    );

    const encryptedPassword = await encryptPassword.generatePasswordHash(
      registerUserData.password
    );

    if (registerUserData.profileImage) {
      console.log("PPPPPPPPPPPPPPPP");
      await encryptPassword
        .checkImageFile(registerUserData.profileImage.buffer)
        .then((isCorrupt) => {
          if (isCorrupt === true) {
            throw messages.error.INVALID_FORMAT_OF_PROFILE_IMAGE;
          }
        })
        .catch((e) => {
          throw e;
        });
      const imageFileType =
        constant.FILE_TYPE.ALLOWED_FILE_TYPE_FOR_USER_PROFILE;
      const sizeData = constant.FILE_SIZE.ALLOWED_FILE_SIZE_FOR_USER_PROFILE;
      const convertedSize = [parseInt(sizeData)];

      const imageType = imageFileType.includes(
        registerUserData.profileImage.mimetype
      );
      if (imageType === false) {
        throw messages.error.INVALID_FORMAT_OF_PROFILE_IMAGE;
      } else if (registerUserData.profileImage.size > convertedSize[0]) {
        throw messages.error.INVALID_SIZE_OF_PROFILE_IMAGE;
      }
    }
    const image = await imageUpload(registerUserData.profileImage);
    console.log("image==========>", image);

    if (mobileAlreadyExist.length > 0) {
      throw messages.error.mobileConflict;
    } else if (checkValidPassword === false) {
      throw messages.error.INVALID_PASSWORD;
    } else if (registerUserData.password !== registerUserData.confirmPassword) {
      throw messages.error.PASSWORD_MISMATCH;
    } else if (emailAlreadyExist.length > 0) {
      throw messages.error.emailConflict;
    } else {
      const result = await encryptPassword.checkCountryAndCountryCode(
        registerUserData.country,
        registerUserData.countryCode
      );

      let registerUserObj = {
        firstName: registerUserData.firstName,
        lastName: registerUserData.lastName,
        email: registerUserData.email,
        password: encryptedPassword,
        mobile: registerUserData.mobile,
        profileImageUrl: image,
        role: registerUserData.role.toUpperCase(),
        organization: constant.DEFAULTORGANIZATION,

        country: registerUserData.country,
        countryCode: registerUserData.countryCode,
        zipCode: registerUserData.zipCode,
        permission: defaultPermission[0]._id.toString(),
        isActive: false,
        subscriptions: registerUserData.subscriptions,
      };
      const userData = await dbInstance.insertDocument(
        COLLECTIONS.USERS_COLLECTION_NAME,
        registerUserObj
      );

      console.log("userdata------------->", userData);
      return userData;
    }
  } catch (e) {
    logger.error("userAuthHelper------>registerUserHelper", e);
    throw e;
  }
};

module.exports = { registerUserHelper };
