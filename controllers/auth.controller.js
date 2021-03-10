const User = require("../models/User");

module.exports = UserController = {
  getUsers: async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  },
  getProfile: async (req, res) => {
    const { user } = req;

    res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  },
  register: async (req, res) => {
    await User.create(req.body);
    res.status(201).json({ success: true });
  },

  login: async (req, res) => {
    //get user from request
    const { user } = req;

    //validate password when user exist in db
    const validPassword = await user.validatePassword(req.body.password);

    //if password is invalid, throw error
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        errors: [{ password: "Invalid Credentials" }],
      });
    }

    //generate jwt
    const token = await user.issueJWT();

    sendTokenResponse(token, res, user);
  },

  adminLogin: async (req, res) => {
    //get user from request
    const { user } = req;

    //validate password when user exist in db
    const validPassword = await user.validatePassword(req.body.password);

    //if password is invalid, throw error
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        errors: [{ password: "Invalid Credentials" }],
      });
    }

    //generate jwt
    const token = await user.issueJWT();

    sendTokenResponse(token, res);
  },
};

const sendTokenResponse = async (token, res, user) => {
  res.status(200).header("Authorization", token).json({ success: true, user });
};
