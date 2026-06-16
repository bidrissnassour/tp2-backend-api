const express = require("express");
const {
  registerValidator,
  loginValidator,
  handleValidationErrors,
} = require("../validators/authValidator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  register
);

router.post("/login", loginValidator, handleValidationErrors, login);

module.exports = router;
