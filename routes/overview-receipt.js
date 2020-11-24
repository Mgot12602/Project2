const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = require("express").Router();

<<<<<<< HEAD
=======
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
>>>>>>> 56424145e107ce2fabbc0bd5e60d6245d3a46af8
router.get("/", isLoggedIn, (req, res) => {
  User.find(req.session.user._id) // only my receipts
    .populate({ path: "receipts" })
    .sort({ category: 1 })
    .then((populatedUser) => {
      console.log("What we get after populating:", populatedUser);
      const receipts = populatedUser[0].receipts;
      console.log("receipts: ", receipts);
      res.render("overview-receipts", { receipts });
    });
});

module.exports = router;
