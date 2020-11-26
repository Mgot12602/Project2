const express = require("express");
const router = express.Router();
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");

/* GET /profile page */
router.get("/", isLoggedIn, (req, res, next) => {
  let pageTitle = "PROFILE";
  User.findById(req.session.user._id).then((userInfo) => {
    console.log("User info", userInfo);
    res.render("profile/profile", { user: userInfo, pageTitle: pageTitle });
  });
});

router.get("/edit", isLoggedIn, (req, res, next) => {
  let pageTitle = "EDIT PROFILE";
  User.findById(req.session.user._id).then((userInfo) => {
    console.log("User info", userInfo);
    res.render("profile/edit-profile", {
      user: userInfo,
      pageTitle: pageTitle,
    });
  });
});

router.post("/edit", isLoggedIn, (req, res) => {
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
  )
    .then((newAndUpdatedUser) => {
      console.log("This is the updated user info", newAndUpdatedUser);
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

module.exports = router;
