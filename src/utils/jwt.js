const jwt = require("jsonwebtoken");

const getRequiredSecret = (secret, name) => {
  if (!secret) {
    throw new Error(`${name} manquant`);
  }

  return secret;
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, getRequiredSecret(process.env.JWT_SECRET, "JWT_SECRET"), {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    getRequiredSecret(process.env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"),
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
