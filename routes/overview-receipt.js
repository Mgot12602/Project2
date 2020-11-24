const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = require("express").Router();

// Find the user and show his receipts
// populate the array of receipts
router.get("/", isLoggedIn, (req, res) => {
  User.find(req.session.user._id) // only my receipts
    .populate({
      path: "receipts",
      select: "",
      /*,
      match: { category: "workspace" }*/ options: { sort: "date" },
    })
    .then((populatedUser) => {
      console.log("What we get after populating:", populatedUser);
      const receipts = populatedUser[0].receipts;
      console.log("receipts: ", receipts);
      res.render("overview-receipts", { receipts });
    });
});

router.post("/search", isLoggedIn, (req, res) => {
  const { sort, direction, category } = req.body;
  User.find(req.session.user._id) // only my receipts
    .populate({
      path: "receipts",
      select: "",
      /*,
      match: { category: "workspace" }*/ options: { sort: sort },
    })
    .then((populatedUser) => {
      console.log("What we get after populating:", populatedUser);
      const receipts = populatedUser[0].receipts;
      console.log("receipts: ", receipts);
      res.render("overview-receipts", { receipts });
    });
});

module.exports = router;
