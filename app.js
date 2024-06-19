const express = require("express");
const AppConfig = require("./config/app-config");
const Routes = require("./routes");
const constant = require("./config/constant");
const logger = require("loglevel");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const yaml = require("js-yaml");
const fs = require("fs");
const useragent = require("express-useragent");

const app = express();
app.use(
  require("cors")({
    origin: constant.ALLOWED_ORIGINS,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express());

function appConfig() {
  new AppConfig(app).includeConfig();
}

/* Including app Routes starts */
function includeRoutes() {
  logger.warn("inside routes");
  new Routes(app).routesConfig();
}
/* Including app Routes ends */

function startTheServer() {
  appConfig();
  includeRoutes();
  const port = constant.PORT || 4009;

  const swaggerYamlPath = path.join(__dirname, "/asset/realestate.yaml");
  const yamlFile = fs.readFileSync(swaggerYamlPath, "utf8");
  const swaggerSpec = yaml.load(yamlFile);
  const swaggerUiOptions = {
    explorer: true,
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );

  app.listen(port, () => {
    logger.warn(`Listening on http://localhost:${port}`);
  });
}

startTheServer();
