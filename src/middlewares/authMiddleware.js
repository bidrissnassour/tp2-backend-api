const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token absent",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET manquant");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide",
    });
  }
};

module.exports = authMiddleware;
