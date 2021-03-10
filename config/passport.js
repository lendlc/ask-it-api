const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const { jwtToken } = require("./appConfig");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtToken.secret,
};

const jwt = new JwtStrategy(options, async (payload, done) => {
  try {
    //find user by UID sent from payload
    const user = await User.findOne({ where: { uid: payload.sub } });

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = (passport) => {
  passport.use(jwt);
};
