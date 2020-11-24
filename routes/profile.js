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

router.get("/edit", (req, res, next) => {
  User.findById(req.session.user._id).then((userInfo) => {
    console.log("User info", userInfo);
    res.render("profile/edit-profile", { user: userInfo });
  });
});

router.post("/edit", shouldNotBeLoggedIn, (req, res) => {
  const {
    // email,
    // password,
    name,
    surname,
    taxId,
    companyName,
    companyAdress,
  } = req.body;
  User.findByIdAndUpdate(
    req.session.user._id,
    {
      name: name,
      surname: surname,
      taxId: taxId,
      companyName: companyName,
      companyAdress: companyAdress,
    },
    { new: true }
  ).then((newAndUpdatedUser) => {
    console.log("This is the updated user info", newAndUpdatedUser);
    res.redirect("/profile");
  });
});

module.exports = router;
