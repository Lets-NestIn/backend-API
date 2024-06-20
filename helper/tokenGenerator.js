const tokenGenerator = require("jsonwebtoken");
const constant = require("../config/constant");

module.exports.generateToken = (options) => {
  const payload = options;

  const accessToken = tokenGenerator.sign(
    payload,
    constant.ACCESSTOKENSECRETKEY,
    {
      expiresIn: "90h",
    }
  );

  const refreshToken = tokenGenerator.sign(
    payload,
    constant.REFRESHTOKENSECRETKEY,
    {
      expiresIn: "90h",
    }
  );

  return { accessToken, refreshToken };
};
