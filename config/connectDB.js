const { db } = require("./appConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(db.name, db.user, db.password, {
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
