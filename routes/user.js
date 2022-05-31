const express = require("express");
const database = require("../config/database").connect();
const bcrypt = require("bcrypt");
const passport = require("passport");
const auth = require("../config/auth");
const { append } = require("express/lib/response");

const router = express.Router();

router.get("/", auth.isAuthenticated, (req, res) => {
  return res.status(200).render("user/user");
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
  const { email, password, passwordRepeat } = req.body;
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
      if (!(email && password && passwordRepeat)) {
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
          `INSERT INTO users(user_email, user_password) VALUES ('${email}', '${hash}');`,
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
    successRedirect: "/user",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

module.exports = router;
