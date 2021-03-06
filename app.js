require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const mySqlStore = require("express-mysql-session")(session);

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new mySqlStore({
      host: "localhost",
      user: "root",
      password: "",
      database: "warehouse",
      clearExpired: true,
      checkExpirationInterval: 1000 * 60 * 60 * 24,
    }),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.authenticate("session"));
require("./config/passport");
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("loggedIn", "true");
  }
  return next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("*", (req, res) => {
  return res.status(404).render("notFound");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
