const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = require("express").Router();

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
