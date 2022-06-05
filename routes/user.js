const express = require("express");
const database = require("../config/database").connect();
const bcrypt = require("bcrypt");
const passport = require("passport");
const auth = require("../config/auth");

const router = express.Router();

router.get("/", auth.isAuthenticated, (req, res) => {
  database.query(
    `SELECT * FROM users WHERE user_id = '${req.user}';`,
    (err, result) => {
      if (err) {
        console.error(err);
      }

      const user = result[0];
      return res.status(200).render("user/user", { user });
    }
  );
});

router.get("/register", auth.alreadyAuthenticated, (req, res) => {
  return res.status(200).render("user/register");
});

router.get("/login", auth.alreadyAuthenticated, (req, res) => {
  return res.status(200).render("user/login");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "you are logged out");
    return res.redirect("/user/login");
  });
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, passwordRepeat } = req.body;
  database.query(
    `SELECT * FROM users WHERE user_email = '${email}';`,
    (err, result) => {
      if (err) {
        console.error(err);
      }

      const user = result[0];
      if (user) {
        req.flash("error", "user with that email already exist");
        return res.status(400).redirect("/user/register");
      }
      if (!(firstName && lastName && email && password && passwordRepeat)) {
        return res.status(400).redirect("/user/register");
      }
      if (firstName.length < 2) {
        req.flash("error", "first name should contain at least 2 characters");
        return res.status(400).redirect("/user/register");
      }
      if (lastName.length < 2) {
        req.flash("error", "last name should contain at least 2 characters");
        return res.status(400).redirect("/user/register");
      }
      if (password.length < 6) {
        req.flash("error", "password should contain at least 6 characters");
        return res.status(400).redirect("/user/register");
      }
      if (password != passwordRepeat) {
        req.flash("error", "passwords don't match");
        return res.status(400).redirect("/user/register");
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
        }
        database.query(
          `INSERT INTO users(user_first_name, user_last_name, user_email, user_password) VALUES ('${firstName}', '${lastName}', '${email}', '${hash}');`,
          (err) => {
            if (err) {
              console.error(err);
            }
            req.flash("success", "you have been successfully registered");
            return res.status(201).redirect("/user/login");
          }
        );
      });
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: "/user",
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // cookie expires after 7 days
    } else {
      req.session.cookie.maxAge = null; // cookie expires at end of session
    }
    return res.redirect("/user");
  }
);

module.exports = router;
