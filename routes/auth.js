const router = require("express").Router();
const user = require("../controllers/auth.controller");
const userExists = require("../middlewares/userExists");
const passport = require("passport");
const passportJwt = passport.authenticate("jwt", { session: false });
const {
  registrationValidationRules,
  adminLoginValidationRules,
  loginValidationRules,
  validate,
} = require("../middlewares/validator");

router
  .route("/register")
  .post(registrationValidationRules(), validate, user.register);

router
  .route("/login")
  .post(loginValidationRules(), validate, userExists, user.login);

router
  .route("/login/admin")
  .post(adminLoginValidationRules(), validate, userExists, user.adminLogin);

router.route("/profile").get(passportJwt, user.getProfile);

router.route("/users").get(passportJwt, user.getUsers);

module.exports = router;
