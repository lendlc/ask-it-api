require("dotenv").config({
  path: `${__dirname}/.env.${process.env.NODE_ENV}`,
});

const db = {
  name: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const jwtToken = {
  secret: process.env.JWT_SECRET,
};

module.exports = { db, jwtToken };
