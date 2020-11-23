const express = require("express");
const router = express.Router();
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");

/* GET /profile page */
router.get("/", (req, res, next) => {
  User.findById(req.session.user._id).then((userInfo) => {
    console.log("User info", userInfo);
    res.render("profile/profile", { user: userInfo });
  });
});
module.exports = router;
