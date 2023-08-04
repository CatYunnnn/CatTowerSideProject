const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userList = require("../models/user");
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: "name" }, (name, password, done) => {
      userList
        .findOne({ name })
        .then((user) => {
          if (user) {
            console.log("find successful");
          }
          if (!user) {
            console.log("failure");
            return done(null, false, {
              message: "That email is not registered!",
            });
          }
          if (user.password !== password) {
            return done(null, false, {
              message: "Email or Password incorrect.",
            });
          }
          return done(null, user);
        })
        .catch((err) => done(err, false));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    userList
      .findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
