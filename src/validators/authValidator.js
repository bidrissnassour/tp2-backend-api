const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .trim()
    .escape(),

  body("email")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  return next();
};

module.exports = {
  registerValidator,
  loginValidator,
  handleValidationErrors,
};
