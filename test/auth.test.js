require("../config/connectDB");
const User = require("../models/User");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.should();
chai.use(chaiHttp);

describe("POST /auth/register/tutee", () => {
  //Clear users table then add admin account before test starts
  before((done) => {
    User.destroy({ truncate: true });
    console.log("User Table Cleared");
    setTimeout(async function () {
      await User.create({
        firstName: "Ask IT",
        lastName: "Admin",
        email: "cuyuganjt@students.national-u.edu.ph",
        role: "admin",
        password: "askitmobile2021",
      });
      console.log('Admin Created!')
      done();
    }, 200);
  });

  const path = "/api/auth/register/tutee";

  it("should successfuly register a new tutee", (done) => {
    const tutee = {
      firstName: "Lendl",
      lastName: "Cuyugan",
      email: "valid@students.national-u.edu.ph",
      role: "tutee",
      password: "password2020",
    };

    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        //check status code
        res.should.have.status(201);
        //check data type
        res.body.should.be.an("object");
        //check content of response
        res.body.should.have.property("success").equal(true);
        done();
      });
  });

  it("should not register a new tutee with invalid endpoint", (done) => {
    const tutee = {
      firstName: "Lendl",
      lastName: "Cuyugan",
      email: "cuyuganjt@students.national-u.edu.ph",
      role: "tutee",
      password: "password2020",
    };

    chai
      .request(app)
      .post(`${path}s`)
      .send(tutee)
      .end((err, res) => {
        //check status code
        res.should.have.status(404);
        done();
      });
  });

  it("should not register a new tutee when email is already used", (done) => {
    const tutee = {
      firstName: "Lendl",
      lastName: "Cuyugan",
      email: "valid@students.national-u.edu.ph",
      role: "tutee",
      password: "password2020",
    };

    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("User already exists");
        done();
      });
  });

  it("should not register a new tutee without firstName", (done) => {
    const tutee = {
      lastName: "Cuyugan",
      email: "1@students.national-u.edu.ph",
      role: "tutee",
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("firstName")
          .equal("First name is required");
        done();
      });
  });

  it("should not register a new tutee without lastName", (done) => {
    const tutee = {
      firstName: "Lendl",
      email: "2@students.national-u.edu.ph",
      role: "tutee",
      password: "password2020",
    };

    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("lastName")
          .equal("Last name is required");
        done();
      });
  });

  it("should not register a new tutee without email", (done) => {
    const tutee = {
      firstName: "Lendl",
      lastName: "Cuyugan",
      role: "tutee",
      password: "password2020",
    };

    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Email is required");
        done();
      });
  });

  it("should not register a new tutee without password", (done) => {
    const tutee = {
      firstName: "Lendl",
      lastName: "Cuyugan",
      email: "3@students.national-u.edu.ph",
      role: "tutee",
    };

    chai
      .request(app)
      .post(path)
      .send(tutee)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("password")
          .equal("Password is required");
        done();
      });
  });
});

describe("POST /auth/login", () => {
  const path = "/api/auth/login";

  it("should successuly login", (done) => {
    const user = {
      email: "valid@students.national-u.edu.ph",
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        //console.log(res.header);
        res.should.have.status(200);
        res.body.should.have.property("success").to.be.eq(true);
        //check for auth header
        res.header.should.have.property("authorization");
        done();
      });
  });

  it("should not successuly login without existing user/email", (done) => {
    const user = {
      email: "idontexist@students.national-u.edu.ph",
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Invalid Credentials");
        done();
      });
  });

  it("should not successuly login with invalid password", (done) => {
    const user = {
      email: "valid@students.national-u.edu.ph",
      password: "invalidpassword",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("password")
          .equal("Invalid Credentials");
        done();
      });
  });

  it("should not successuly login without email", (done) => {
    const user = {
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Email is required");
        done();
      });
  });

  it("should not successuly login without password", (done) => {
    const user = {
      email: "valid@students.national-u.edu.ph",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("password")
          .equal("Password is required");
        done();
      });
  });
});

describe("POST /auth/login/admin", () => {
  const path = "/api/auth/login/admin";

  it("should successuly login admin", (done) => {
    const user = {
      email: "cuyuganjt@students.national-u.edu.ph",
      password: "askitmobile2021",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("success").to.be.eq(true);
        //check for auth header
        res.header.should.have.property("authorization");
        done();
      });
  });

  it("should not successuly login admin when user role is not admin", (done) => {
    const user = {
      email: "valid@students.national-u.edu.ph",
      password: "askitmobile2021",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Invalid Credentials");
        done();
      });
  });

  it("should not successuly login without existing user/email", (done) => {
    const user = {
      email: "idontexist@students.national-u.edu.ph",
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Invalid Credentials");
        done();
      });
  });

  it("should not successuly login with invalid password", (done) => {
    const user = {
      email: "cuyuganjt@students.national-u.edu.ph",
      password: "invalidpassword",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("password")
          .equal("Invalid Credentials");
        done();
      });
  });

  it("should not successuly login without email", (done) => {
    const user = {
      password: "password2020",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("email")
          .equal("Email is required");
        done();
      });
  });

  it("should not successuly login without password", (done) => {
    const user = {
      email: "cuyuganjt@students.national-u.edu.ph",
    };
    chai
      .request(app)
      .post(path)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("success").to.be.eq(false);
        res.body.should.have.property("errors");
        res.body.errors[0].should.be.an("object");
        res.body.errors[0].should.have
          .property("password")
          .equal("Password is required");
        done();
      });
  });
});
