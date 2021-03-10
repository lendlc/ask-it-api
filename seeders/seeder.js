const User = require("../models/User");

const seedData = async () => {
  try {
    await User.create({
      firstName: "Ask IT",
      lastName: "Admin",
      email: "askitadmin@students.national-u.edu.ph",
      role: "admin",
      password: "askitmobile2021",
    });

    console.log("Data added Succesfully!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.destroy({ truncate: true });
    console.log("Data deleted Succesfully!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//command to run file
//node seeder '-i' || '-d'
//i || d = [2]
process.argv[2] === "-i"
  ? seedData()
  : process.argv[2] === "-d"
  ? deleteData()
  : process.exit(console.log("Invalid Command"));
