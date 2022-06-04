const LocalStrategy = require("passport-local");
const database = require("./database").connect();
const passport = require("passport");
const bcrypt = require("bcrypt");

const verify = (email, password, done) => {
  database.query(
    `SELECT * FROM users WHERE user_email = '${email}';`,
    (err, result) => {
      if (err) {
        return done(err);
      }

      const user = result[0];
      if (!user) {
        return done(null, false, { message: "that email is not registered" });
      }
      bcrypt.compare(password, user.user_password, (err, result) => {
        if (err) {
          return done(err);
        }
        if (result) {
          return done(null, user);
        }
        return done(null, false, { message: "password incorrect" });
      });
    }
  );
};

passport.use(new LocalStrategy({ usernameField: "email" }, verify));
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});
passport.deserializeUser((id, done) => {
  return done(null, id);
});
