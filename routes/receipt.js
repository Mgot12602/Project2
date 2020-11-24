const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const router = require("express").Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const uploader = require("../config/cloudinary.config.js");

//GET AND POST FOR NEW RECEIPT
router.get("/new-receipt", isLoggedIn, (req, res) => {
  res.render("new-receipt");
});

router.post(
  "/new-receipt",
  uploader.single("image"),
  isLoggedIn,
  (req, res, next) => {
    // the uploader.single() callback will send the file to cloudinary and get you and obj with the url in return
    console.log("file is: ", req.file);

    if (!req.file) {
      console.log("there was an error uploading the file");
      next(new Error("No file uploaded!"));
      return;
    }
    // You will get the image url in 'req.file.path'
    // Your code to store your url in your database should be here
    const { image, title, category, date, amount, comment } = req.body;
    Receipt.create({
      image: req.file.path,
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
  }
);

//GET RECEIPT DETAILS
router.get("/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  Receipt.findById(id)
    .then((receiptDetails) => {
      console.log("Receipt:", receiptDetails);
      res.render("details-receipt", { receiptDetails });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/overview-receipts");
    });
});

module.exports = router;
