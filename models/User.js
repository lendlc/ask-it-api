const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/appConfig");
const db = require("../config/connectDB");

const User = db.define("user", {
  uid: {
    type: Sequelize.INTEGER(),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM("tutee", "tutor", "admin"),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    isEmail: true,
  },
  password: {
    type: Sequelize.STRING(),
    allowNull: false,
  },
  resetPasswordToken: Sequelize.STRING(),
  resetPasswordExpires: Sequelize.DATE,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

//hash password upon creation
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

//validates if user input password during login is correct
User.prototype.validatePassword = async function (password) {
  //checks if password has value, if none, return false
  if (password) {
    return await bcrypt.compare(password, this.password);
  }
  return false;
};

User.prototype.issueJWT = function () {
  const id = this.uid;
  const expiresIn = "365d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, jwtToken.secret, {
    expiresIn,
  });

  return `Bearer ${token}`;
};

module.exports = User;
