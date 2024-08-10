const mongoose = require("mongoose");
const logger = require("loglevel");
const constant = require("../config/constant");
const { COLLECTIONS } = require("../config/constant");

const message = require("../config/messages");
const { PropertyModel } = require("../models/property");
const { UserModel } = require("../models/user");

require("dotenv").config();

class DbHelper {
  async connect() {
    if (!this.db) {
      try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(`${constant.MONGO_DB_URL}`, {});
        this.db = mongoose.connection;
        return;
      } catch (e) {
        logger.error("DbHelper Error while connect mongodb ::: ", e);
        throw Error(e);
      }
    }
  }

  async insertDocument(collection, docObj) {
    try {
      if (Object.keys(docObj).length === 0 && docObj.constructor === Object) {
        throw message.error.INSERT_MONGODB;
      }

      let modelInstance;

      switch (collection) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          modelInstance = new PropertyModel(docObj);
          break;
        case COLLECTIONS.USER_COLLECTION:
          modelInstance = new UserModel(docObj);
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      return await modelInstance.save();
    } catch (e) {
      throw e;
    }
  }

  async getDocumentByQuery(collection, query) {
    try {
      let Model;
      switch (collection) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          Model = PropertyModel;
          break;
        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      const response = await Model.findOne(query);
      return response;
    } catch (e) {
      logger.error("DbHelper Error while getDocument ::: ", e);
      throw e;
    }
  }

  async getUsersByPropertyId(collection, id) {
    try {
      let Model;
      switch (collection) {
        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();

      const response = await Model.find({
        favouritePropertiesId: { $in: id },
      });

      return response;
    } catch (e) {
      logger.error("DbHelper Error while getDocument ::: ", e);
      throw e;
    }
  }

  async getDocumentByQueryDetails(collection, query) {
    try {
      let Model;
      switch (collection) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          Model = PropertyModel;
          break;
        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      const response = await Model.find(query);
      return response;
    } catch (e) {
      logger.error("DbHelper Error while getDocument ::: ", e);
      throw e;
    }
  }

  async updateDocument(collection, query, docObj) {
    try {
      let Model;
      switch (collection) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          Model = PropertyModel;
          break;

        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;

        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }
      await this.connect();
      const response = await Model.updateOne(query, docObj);
      return response;
    } catch (e) {
      logger.error("DbHelper Error while updateDocument ::: ", e);
      throw e;
    }
  }

  async findall(collectionName) {
    try {
      let Model;
      switch (collectionName) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          Model = PropertyModel;
          break;
        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }
      await this.connect();
      const response = await Model.find();
      return response;
    } catch (e) {
      logger.error("DbHelper Error while findall ::: ", e);
      throw e;
    }
  }

  async deleteDocumentByQuery(collection, query) {
    try {
      let Model;
      switch (collection) {
        case COLLECTIONS.PROPERTY_COLLECTION:
          Model = PropertyModel;
          break;
        case COLLECTIONS.USER_COLLECTION:
          Model = UserModel;
          break;
        default:
          throw message.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      const response = await Model.findByIdAndDelete(query);
      return response;
    } catch (e) {
      logger.error("DbHelper Error while getDocument ::: ", e);
      throw e;
    }
  }
}

module.exports = {
  DbHelper,
};
