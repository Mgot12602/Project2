const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = require("express").Router();

// * Find receipt with porperty called user with value = user._id
//router.get("/", isLoggedIn, (req, res) => {
//  Receipt.find(user.req.session.user._id) // only my receipts
//    .sort({ date: -1 })
//    //.limit(10)
//    //.populate("user")
//    .then((receipts) => {
//      console.log("receipts:", receipts);
//      res.render("overview-receipts", { receipts });
//    });
//});

// Find the user and show his receipts
// populate the array of receipts
router.get("/", isLoggedIn, (req, res) => {
  User.find(req.session.user._id) // only my receipts
    .populate("receipts")
    .then((populatedUser) => {
      console.log("What we get after populating:", populatedUser);
      const receipts = populatedUser[0].receipts;
      console.log("receipts: ", receipts);
      res.render("overview-receipts", { receipts });
    });
});

module.exports = router;
