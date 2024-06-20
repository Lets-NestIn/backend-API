const mongoose = require("mongoose");
const logger = require("loglevel");
const constant = require("../config/constant");
const { COLLECTIONS } = require("../config/constant");
const model = require("../models/userModel");

const messages = require("../config/messages");

require("dotenv").config();
const message = require("../config/messages");
const { isPositiveNumber } = require("../helper/helperFunction");

class DbHelper {
  async connect() {
    if (!this.db) {
      try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(`${constant.MONGO_DB_URL}`, {
          useNewUrlParser: true,
        });
        this.db = mongoose.connection;
        return;
      } catch (e) {
        logger.error("DbHelper Error while connect mongodb ::: ", e);
        throw e;
      }
    }
  }
  async insertDocument(collection, docObj) {
    try {
      if (Object.keys(docObj).length === 0 && docObj.constructor === Object) {
        throw messages.error.INSERT_MONGODB;
      }

      let modelInstance;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          modelInstance = new model.Users(docObj);
          break;

        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      const savedData = await modelInstance.save();
      console.log("savedData====>", savedData);
      return savedData;
    } catch (e) {
      throw e;
    }
  }

  async getDocumentById(collection, id) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;
        case COLLECTIONS.TAGS_COLLECTION_NAME:
          Model = tagsModel.Tags;
          break;
        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      return await Model.findById(id);
    } catch (e) {
      throw e;
    }
  }

  async getMultipleDocumentsByIds(collection, ids) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;
        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();

      return await Model.find(ids);
    } catch (e) {
      throw e;
    }
  }

  async getDocumentByObj(collection, obj) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;

        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();

      return await Model.find(obj);
    } catch (e) {
      throw e;
    }
  }

  async getDocumentByQueries(collection, queries) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;

        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();

      for (const query of queries) {
        const result = await Model.find(query);

        if (result.length > 0) {
          let fieldName = Object.keys(query)[0];
          fieldName = fieldName === "firstName" ? "customerName" : fieldName;

          throw `${fieldName} is already in use.`;
        }
      }

      return "No duplicates found";
    } catch (e) {
      throw e;
    }
  }

  async getAllDocuments(collection, options) {
    try {
      if (options.pageNo) {
        const pNumber = isPositiveNumber(options.pageNo);
        if (!pNumber) {
          throw message.error.INVALID_PAGE_NUMBER;
        }
      }
      if (options.pageSize) {
        const pSize = isPositiveNumber(options.pageSize);
        if (!pSize) {
          throw message.error.INVALID_PAGE_SIZE;
        }
      }

      await this.connect();
      let Model;

      if (collection === COLLECTIONS.USERS_COLLECTION_NAME) {
        Model = model.Users;

        let query;

        if (options.userInfo.role === constant.ROLES_ENUM_VALUE.SUPER_ADMIN) {
          query = Model.find({ role: constant.ROLES_ENUM_VALUE.EMPLOYEE });
        } else {
          query = Model.find({
            $or: [
              { organization: { $in: options.organizationNames } },
              { organization: options.userInfo.organization },
            ],
            role: constant.ROLES_ENUM_VALUE.EMPLOYEE,
          });
        }

        if (options.isArchive) {
          let isArchive = options.isArchive === "true" ? true : false;
          query = query.where("isArchive").equals(Boolean(isArchive));
        }

        if (options.firstName) {
          query = query
            .where("firstName")
            .regex(new RegExp("^" + options.firstName, "i"));
        }

        if (options.pageNo && options.pageSize) {
          const skip = (options.pageNo - 1) * options.pageSize;
          query = query.skip(skip).limit(options.pageSize);
        }

        query = query.sort({ createdAt: -1 });

        const [documents, count] = await Promise.all([
          query.exec(),
          Model.countDocuments(query.getQuery()),
        ]);

        return { documents, count };
      } else if (collection === COLLECTIONS.TAGS_COLLECTION_NAME) {
        Model = tagsModel.Tags;

        let query;

        if (options.userInfo.role === constant.ROLES_ENUM_VALUE.SUPER_ADMIN) {
          query = Model.find();
        } else {
          query = Model.find({
            $or: [
              { createdBy: options.userInfo.email },
              { createdByRole: constant.ROLES_ENUM_VALUE.SUPER_ADMIN },
              { organization: { $in: options.organizationNames } },
            ],
          });
        }

        if (options.typeOfTag) {
          query = query
            .where("typeOfTag")
            .regex(new RegExp("^" + options.typeOfTag, "i"));
        }

        if (options.tagName) {
          query = query
            .where("tagName")
            .regex(new RegExp("^" + options.tagName, "i"));
        }

        if (options.type) {
          query = query
            .where("type")
            .regex(new RegExp("^" + options.type, "i"));
        }

        if (options.pageNo && options.pageSize) {
          const skip = (options.pageNo - 1) * options.pageSize;
          query = query.skip(skip).limit(options.pageSize);
        }

        query = query.sort({ createdAt: -1 });

        const [documents, count] = await Promise.all([
          query.exec(),
          Model.countDocuments(query.getQuery()),
        ]);

        return { documents, count };
      } else {
        throw message.error.INVALID_COLLECTION_NAME;
      }
    } catch (e) {
      throw e;
    }
  }

  async updateDocumentById(collection, id, updateObj) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;
        case COLLECTIONS.TAGS_COLLECTION_NAME:
          Model = tagsModel.Tags;
          break;
        case COLLECTIONS.COMPANY_COLLECTION_NAME:
          Model = Company;
          break;
        case COLLECTIONS.CUSTOMER_COLLECTION_NAME:
          Model = Customer;
          break;
        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      return await Model.findByIdAndUpdate(id, updateObj, { new: true });
    } catch (e) {
      throw e;
    }
  }

  async deleteDocumentById(collection, id) {
    try {
      let Model;

      switch (collection) {
        case COLLECTIONS.USERS_COLLECTION_NAME:
          Model = model.Users;
          break;
        case COLLECTIONS.TAGS_COLLECTION_NAME:
          Model = tagsModel.Tags;
          break;
        case COLLECTIONS.ROLE_COLLECTION_NAME:
          Model = roleModel;
          break;
        case COLLECTIONS.PERMISSION_COLLECTION_NAME:
          Model = permissionModel;
          break;
        case COLLECTIONS.HOSTED_DOMAIN_COLLECTION_NAME:
          Model = hostedDomainModel;
          break;
        default:
          throw messages.error.INVALID_COLLECTION_NAME;
      }

      await this.connect();
      return await Model.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  DbHelper,
};
