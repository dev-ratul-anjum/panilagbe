var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const passport = require('passport');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    const user = await User.findOne({_id: jwt_payload.id});
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.error("🔥 Error in JWT authentication:", error);
    return done(error, false);
  }
}));

module.exports = passport;

