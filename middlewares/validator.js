const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const registrationValidationRules = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .bail()
      .isString(),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .bail()
      .isString(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .bail()
      .custom(async (val) => {
        const user = await User.findOne({ where: { email: val } });

        if (user) {
          return Promise.reject("User already exists");
        }
      })
      .bail()
      .custom((val) => {
        //validates if the email provided is a NU email
        if (val.endsWith("@students.national-u.edu.ph")) return true;
      })
      .withMessage("Please provide a valid NU email"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .bail()
      .isIn("tutee, tutor")
      .withMessage("Invalid role"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 characters long"),
  ];
};

const loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .bail()
      .custom(async (val) => {
        //checks if user exists
        const user = await User.findOne({ where: { email: val } });

        if (!user) {
          return Promise.reject("Invalid Credentials");
        }
      }),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const adminLoginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .bail()
      .custom(async (val) => {
        //checks if user exists
        const user = await User.findOne({
          where: { email: val, role: "admin" },
        });

        if (!user) {
          return Promise.reject("Invalid Credentials");
        }
      }),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const validate = (req, res, next) => {
  const err = validationResult(req);

  //if errors is empty proceed to next middleware
  if (err.isEmpty()) {
    return next();
  }

  const formattedErrors = [];
  err.errors.forEach((x) => {
    formattedErrors.push({ [x.param]: x.msg });
  });

  return res.status(400).json({ success: false, errors: formattedErrors });
};

module.exports = {
  registrationValidationRules,
  loginValidationRules,
  adminLoginValidationRules,
  validate,
};
