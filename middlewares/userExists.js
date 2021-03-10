const User = require("../models/User");

const userExists = async (req, res, next) => {
  //get email from request
  const { email } = req.body;

  //check if email already exists from db
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({
      success: false,
      errors: [{ email: "Invalid Credentials" }],
    });
  }

  //pass user data to next middleware
  req.user = user;
  next();
};

module.exports = userExists;
