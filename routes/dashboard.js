const express = require("express");
const auth = require("../config/auth");

const router = express.Router();

router.get("/", auth.isAuthenticated, (req, res) => {
  return res.status(200).render("dashboard/dashboard");
});

module.exports = router;
