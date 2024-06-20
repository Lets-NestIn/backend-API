const bcrypt = require("bcryptjs");

// Function to check if an image file is corrupt
const checkImageFile = async (filePath) => {
  try {
    await sharp(filePath).metadata();
    return false;
  } catch (err) {
    return true;
  }
};

const checkCountryAndCountryCode = async (countries, countryCode) => {
  const matchingCountry = constant.countries.find(
    (country) =>
      country.country === countries && country.countryCode === countryCode
  );

  if (!matchingCountry) {
    throw "Invalid country and countryCode combination";
  }

  return matchingCountry;
};

const generatePasswordHash = async (plainPassword) => {
  let salt = bcrypt.genSaltSync(11);
  return bcrypt.hashSync(plainPassword, salt);
};

const comparePasswordHash = async (plainPassword, hash) => {
  return bcrypt.compareSync(plainPassword, hash);
};

module.exports = {
  comparePasswordHash,
  generatePasswordHash,
  checkCountryAndCountryCode,
  checkImageFile,
};
