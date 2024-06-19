const trimRequest = require("trim-request");
const constant = require("../config/constant");
class Routes {
  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {
    this.app.use(constant.BASE_URL, trimRequest.all, require("./property"));
  }

  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
