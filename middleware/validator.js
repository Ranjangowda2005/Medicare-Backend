import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((error) => error.msg),
    });
  }

  next();
};

export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name should be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be valid"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be minimum 6 characters"),

  handleValidationErrors,
];

export const validateServices = [
  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Contact number should contain exactly 10 digits"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Description should be maximum 50 characters"),

  handleValidationErrors,
];
