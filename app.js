const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("./config/passport")(passport);
require("./config/connectDB");

const app = express();

// connectDB
//   .authenticate()
//   .then(() => console.log("Database Connected!"))
//   .catch((e) => console.log(`Cannot Connect to Database, Error: ${e.name}`));
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

module.exports = app;
