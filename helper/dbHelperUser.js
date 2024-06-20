const { DbHelper } = require("./dbHelper");
const dbInstance = new DbHelper();
const { COLLECTIONS } = require("../config/constant");
const logger = require("loglevel");
const { generatePasswordHash } = require("./helperFunction");
const message = require("../config/messages");
const constant = require("../config/constant");
const { sendForgetPasswordEmail } = require("./aws");
const { comparePasswordHash } = require("./helperFunction");
const { generateToken } = require("./tokenGenerator");
const redis_client = require("./redisHelper");
const { default: mongoose } = require("mongoose");

let registerUser = async (options) => {
  try {
    let imagesData;

    if (options.profilePicture) {
      imagesData = await fileUpload(options.profilePicture);
    }

    const [isUserRegisteredEmail, isUserRegisteredMobile] = await Promise.all([
      dbInstance.getDocumentByQuery(COLLECTIONS.USER_COLLECTION, {
        email: options.email,
      }),
      dbInstance.getDocumentByQuery(COLLECTIONS.USER_COLLECTION, {
        phoneNumber: options.phoneNumber,
      }),
    ]);

    if (isUserRegisteredEmail) {
      throw new Error(message.error.EMAIL_EXIST);
    }
    if (isUserRegisteredMobile) {
      throw new Error(message.error.MOBILE_EXIST);
    }
    const hashedPassword = await generatePasswordHash(options.password);

    // Create the user object
    const dbObj = {
      email: options.email,
      password: hashedPassword,
      role: options.role,
      firstName: options.firstName,
      lastName: options.lastName,
      phoneNumber: options.phoneNumber,
      address: options.address,
      isActive: true,
      profilePicture: options.profilePicture,
    };

    if (options.role === "AGENT") {
      dbObj.agentLicenseNumber = options.agentLicenseNumber;
      dbObj.agencyName = options.agencyName;
    }

    let user = await dbInstance.insertDocument(
      COLLECTIONS.USER_COLLECTION,
      dbObj
    );

    return user;
  } catch (e) {
    logger.error("dbHelperUser ::::: registerUser", e);
    throw e;
  }
};

const userLogin = async (loginUserData) => {
  try {
    const userDetail = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      { email: loginUserData.email, isActive: true }
    );

    !userDetail
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    const passwordMatch = await comparePasswordHash(
      loginUserData?.password,
      userDetail?.password || ""
    );

    !passwordMatch
      ? (() => {
          throw message.error.INCORRECT_PASSWORD;
        })()
      : null;

    const data = {
      userId: userDetail._id.toString(),
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      email: userDetail.email,
      phoneNumber: userDetail.phoneNumber,
      role: userDetail.role,
      address: userDetail.address,
      isActive: userDetail.isActive,
      favouritePropertiesId: userDetail.favouritePropertiesId,
      agentLicenseNumber: userDetail.agentLicenseNumber,
      agencyName: userDetail.agencyName,
    };

    const jsonToken = generateToken(data);
    const userId = userDetail._id.toString();
    const accessKeyName = `${userId}ACCESSTOKEN${constant.CACHESECRETKEY}`;
    const refreshKeyName = `${userId}REFRESHTOKEN${constant.CACHESECRETKEY}`;
    const redisAccessValue = JSON.stringify(jsonToken.accessToken);
    const redisRefreshValue = JSON.stringify(jsonToken.refreshToken);

    // Check if access token and refresh token already exist and delete them
    const existingAccessToken = await redis_client.get(accessKeyName);
    if (existingAccessToken) {
      await redis_client.del(existingAccessToken);
    }
    const existingRefreshToken = await redis_client.get(refreshKeyName);
    if (existingRefreshToken) {
      await redis_client.del(existingRefreshToken);
    }

    await redis_client.set(accessKeyName, redisAccessValue, {
      EX: 100005 * 60 * 60, // Set expiration time for access token
    });
    await redis_client.set(refreshKeyName, redisRefreshValue, {
      EX: 100005 * 60 * 60, // Set expiration time for refresh token
    });

    const accessToken = jsonToken.accessToken;
    const refreshToken = jsonToken.refreshToken;

    return { accessToken, refreshToken };
  } catch (e) {
    logger.error("userAuthHelper ------> officerLogin", e);
    throw e;
  }
};

const updateUser = async (userId, options) => {
  try {
    if (options.tokenUserId !== userId) {
      throw new Error("Unauthorized access");
    }
    let imagesData;
    if (options.profilePicture) {
      imagesData = await fileUpload(options.profilePicture);
    }

    const userObj = {
      firstName: options.firstName,
      lastName: options.lastName,
      phoneNumber: options.phoneNumber,
      address: options.address,
      profilePicture: options.profilePicture,
    };
    let response;
    if (
      options.favouritePropertiesKey === true ||
      options.favouritePropertiesKey === "true"
    ) {
      response = await dbInstance.updateDocument(
        COLLECTIONS.USER_COLLECTION,
        { _id: userId },
        {
          $set: {
            firstName: options.firstName,
            lastName: options.lastName,
            phoneNumber: options.phoneNumber,
            address: options.address,
            profilePicture: options.profilePicture,
          },
          $push: {
            favouritePropertiesId: { $each: options.favouritePropertiesId },
          },
        }
      );
    } else if (
      options.favouritePropertiesKey === false ||
      options.favouritePropertiesKey === "false"
    ) {
      response = await dbInstance.updateDocument(
        COLLECTIONS.USER_COLLECTION,
        { _id: userId },
        {
          $set: {
            firstName: options.firstName,
            lastName: options.lastName,
            phoneNumber: options.phoneNumber,
            address: options.address,
            profilePicture: options.profilePicture,
          },
          $pull: {
            favouritePropertiesId: { $in: options.favouritePropertiesId },
          },
        }
      );
    } else {
      response = await dbInstance.updateDocument(
        COLLECTIONS.USER_COLLECTION,
        { _id: userId },
        {
          $set: {
            firstName: options.firstName,
            lastName: options.lastName,
            phoneNumber: options.phoneNumber,
            address: options.address,
            profilePicture: options.profilePicture,
          },
        }
      );
    }

    if (!response) {
      throw new Error("Property not found");
    }

    return response;
  } catch (e) {
    logger.error("dbHelperProperty ::::: updateProperty", e);
    throw e;
  }
};

const logoutUser = async (options) => {
  try {
    let userId = options.toString();
    let accessKeyName = `${userId}ACCESSTOKEN${constant.CACHESECRETKEY}`;
    let refreshKeyName = `${userId}REFRESHTOKEN${constant.CACHESECRETKEY}`;

    const multi = redis_client.multi();

    multi.del(accessKeyName);
    multi.del(refreshKeyName);

    const replies = await multi.exec();
    const deletedKeysCount = replies.reduce(
      (total, reply) => total + (reply === 1),
      0
    );

    if (deletedKeysCount > 0) {
      return message.success.LOGGED_OUT;
    } else {
      throw { message: message.error.ALREADY_LOGGED_OUT };
    }
  } catch (e) {
    logger.error("userHelper------>userLogout", e);
    throw e;
  }
};

let forgotPassword = async (options) => {
  try {
    let userDetail = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      {
        email: options.email,
      }
    );
    !userDetail
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    let userId = userDetail._id.toString();
    let keyname = `${userId}FORGETPASSWORD${constant.CACHESECRETKEY}`;
    let data = {
      userId: userDetail._id.toString(),
      fullName: userDetail.fullName,
      email: userDetail.email,
      country: userDetail.country,
      countryCode: userDetail.countryCode,
      mobileNumber: userDetail.mobileNumber,
      role: userDetail.role,
    };
    let jsonToken = generateToken(data);
    let accessToken = jsonToken.accessToken;
    await sendForgetPasswordEmail(
      userDetail.fullName,
      options.email,
      "http://localhost:4200/reset-password",
      accessToken
    );

    const redisValue = JSON.stringify(jsonToken.accessToken);
    await redis_client.set(keyname, redisValue, {
      EX: 60 * 60,
    });
    const tokenValue = await redis_client.get(keyname);
    const tokens = JSON.parse(tokenValue);

    let obj = {
      token: tokens,
      message: message.success.RESET_PASSWORD_LINK,
    };

    return obj;
  } catch (e) {
    logger.error("userAuthHelper------>forgotPassword", e);
    throw e;
  }
};

let resetPassword = async (options) => {
  try {
    let response = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      { _id: new mongoose.Types.ObjectId(options._id) }
    );

    let userId = response._id.toString();
    let keyname = `${userId}FORGETPASSWORD${constant.CACHESECRETKEY}`;

    let encryptedPassword = await generatePasswordHash(options.newPassword);
    await dbInstance.updateDocument(
      COLLECTIONS.USER_COLLECTION,
      { _id: new mongoose.Types.ObjectId(options._id) },
      {
        password: encryptedPassword,
        updatedAt: Date.now(),
        updatedBy: new mongoose.Types.ObjectId(userId),
      }
    );

    await redis_client.del(keyname);

    return message.success.PASSWORD_RESET_SUCCESSFULLY;
  } catch (e) {
    logger.error("userAuthHelper------>changePassword", e);
    throw e;
  }
};

const changePasswordHelper = async (options) => {
  try {
    const userInfo = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      { _id: new mongoose.Types.ObjectId(options.userId) }
    );

    options.userId !== options.reqUserId
      ? (() => {
          throw message.error.INVALID_USER;
        })()
      : null;

    !userInfo
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    const password = await comparePasswordHash(
      options.oldPassword,
      userInfo.password
    );

    password === false
      ? (() => {
          throw message.error.INCORRECT_OLD_PASSWORD;
        })()
      : null;
    options.oldPassword === options.newPassword
      ? (() => {
          throw message.error.PASSWORD_ALREADY_USED;
        })()
      : null;

    const encryptedPassword = await generatePasswordHash(options.newPassword);
    const updatePassword = await dbInstance.updateDocument(
      COLLECTIONS.USER_COLLECTION,
      { _id: new mongoose.Types.ObjectId(options.userId) },
      { password: encryptedPassword }
    );

    return updatePassword
      ? message.success.PASSWORD_CHANGED
      : (() => {
          throw message.error.SOMETHING_WENT_WRONG;
        })();
  } catch (e) {
    logger.error("userAuthHelper ------> changePasswordHelper", e);
    throw e;
  }
};

const getUserInfoHelper = async (token) => {
  try {
    token.userId !== token.reqUserId
      ? (() => {
          throw message.error.INVALID_USER;
        })()
      : null;
    const userInfo = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      { _id: new mongoose.Types.ObjectId(token.userId) }
    );

    !userInfo
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    return userInfo;
  } catch (e) {
    logger.error("userAuthHelper------>getUserInfoHelper", e);
    throw e;
  }
};

let generateNewTokens = async (options) => {
  try {
    let response = await dbInstance.getDocumentByQuery(
      COLLECTIONS.USER_COLLECTION,
      {
        _id: new mongoose.Types.ObjectId(options),
      }
    );
    !response
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    let jsonToken;
    let accessKeyName = `${options}ACCESSTOKEN${constant.CACHESECRETKEY}`;
    let refreshKeyName = `${options}REFRESHTOKEN${constant.CACHESECRETKEY}`;
    const tokenData = {
      userId: response._id.toString(),
      fullName: response.fullName,
      mobileNumber: response.mobileNumber,
      role: response.role,
      email: response.email,
      country: response.country,
      countryCode: response.countryCode,
      division: response.division,
    };
    jsonToken = generateToken(tokenData);
    const redisAccessValue = JSON.stringify(jsonToken.accessToken);
    const redisRefreshValue = JSON.stringify(jsonToken.refreshToken);
    await redis_client.set(accessKeyName, redisAccessValue, {
      EX: 5 * 60 * 60,
    });
    await redis_client.set(refreshKeyName, redisRefreshValue, {
      EX: 24 * 60 * 60,
    });
    const tokenAccessValue = await redis_client.get(accessKeyName);
    const tokenRefreshValue = await redis_client.get(refreshKeyName);
    const tokens = JSON.parse(tokenAccessValue);
    const tokensRefresh = JSON.parse(tokenRefreshValue);
    return {
      accessToken: tokens,
      refreshToken: tokensRefresh,
    };
  } catch (e) {
    logger.error("dbHelperUser------>generateNewTokens", e);
    throw e;
  }
};

const usersList = async () => {
  try {
    const userInfo = await dbInstance.findall(COLLECTIONS.USER_COLLECTION);
    if (userInfo.length > 1) {
      return {
        users: userInfo,
        totalCount: userInfo.length,
      };
    } else {
      return {
        users: [],
        totalCount: 0,
      };
    }
  } catch (e) {
    logger.error("dbHelperUser------>usersList", e);
    throw e;
  }
};

const getListOfUsersByPropertyIdHelper = async (propertyId) => {
  try {
    const userInfo = await dbInstance.getUsersByPropertyId(
      COLLECTIONS.USER_COLLECTION,
      // { _id: new mongoose.Types.ObjectId(propertyId) }
      propertyId
    );

    !userInfo
      ? (() => {
          throw message.error.USER_NOT_FOUND;
        })()
      : null;

    return userInfo;
  } catch (e) {
    logger.error("userAuthHelper------>GetListOfUsersByPropertyIdHelper", e);
    throw e;
  }
};

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePasswordHelper,
  getUserInfoHelper,
  generateNewTokens,
  usersList,
  updateUser,
  getListOfUsersByPropertyIdHelper,
};
