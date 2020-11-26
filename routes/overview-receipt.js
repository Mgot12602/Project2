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
      let pageTitle = "Overview";
      res.render("overview-receipts", { receipts, pageTitle: pageTitle });
    })
    .catch((err) => {
      console.log(err);
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.post("/search", isLoggedIn, (req, res) => {
  const { sort, direction, category } = req.body;
  let categorySelector = category;
  console.log("the category is", category);
  if (category === "") {
    console.log("all categories");
    categorySelector = [
      "work euipment",
      "workspace",
      "car",
      "hardware",
      "software",
      "catering",
      "other",
    ];
  }
  console.log("This is the categorySelector", categorySelector);
  User.find(req.session.user._id) // only my receipts
    .populate({
      path: "receipts",
      select: "",

      match: { category: { $in: categorySelector } },
      options: {
        sort: direction + sort,
      },
    })
    .then((populatedUser) => {
      console.log("What we get after populating:", populatedUser);
      const receipts = populatedUser[0].receipts;
      console.log("receipts: ", receipts);
      let pageTitle = "Overview";
      res.render("overview-receipts", { receipts, pageTitle: pageTitle });
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
