const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const router = require("express").Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const uploader = require("../config/cloudinary.config.js");

router.get("/new-receipt", isLoggedIn, (req, res) => {
  res.render("new-receipt");
});

router.post("/new-receipt", isLoggedIn, (req, res) => {
  const { imageURL, title, category, date, amount, comment } = req.body;
  Receipt.create({
    imageURL,
    title,
    category,
    date,
    amount,
    comment,
    user: req.session.user._id,
  }).then((createdReceipt) => {
    // after you create a receipt, the property user was added to it, but the user is not aware of that, so we must edit the user and the receipt to the user's receipt array
    console.log("createdReceipt:", createdReceipt);
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { receipts: createdReceipt._id },
      },
      { new: true }
    ).then((newAndUpdatedUser) => {
      console.log("newAndUpdatedUser:", newAndUpdatedUser);
      res.redirect("/overview-receipts");
    });
  });
});

module.exports = router;
