const Receipt = require("../models/Receipt.model");
const User = require("../models/User.model");
const router = require("express").Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const uploader = require("../config/cloudinary.config.js");
const ChuckNorrisJoke = "https://api.chucknorris.io/jokes/random";
const axios = require("axios");

//GET AND POST FOR NEW RECEIPT
router.get("/new-receipt", isLoggedIn, (req, res) => {
  let pageTitle = "NEW RECEIPT";
  axios.get(ChuckNorrisJoke).then((response) => {
    console.log("response: ", response);
    const jokeText = response.data.value;
    const jokeImage = response.data.icon_url;

    res.render("new-receipt", { jokeText, jokeImage, pageTitle: pageTitle });
  });
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

//GET AND UPDATE RECEIPT DETAILS
router.get("/:id/update-receipt", isLoggedIn, (req, res) => {
  const id = req.params.id;
  let pageTitle = "UPDATE RECEIPT";
  Receipt.findById(id)
    .then((receiptDetails) => {
      console.log("Receipt:", receiptDetails);
      res.render("update-receipt", { receiptDetails, pageTitle: pageTitle });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/overview-receipts");
    });
});

router.post("/:id/update-receipt", isLoggedIn, (req, res) => {
  const { title, category, date, amount, comment } = req.body;
  console.log("req.body: ", req.body);
  console.log(req.params.id);
  Receipt.findByIdAndUpdate(
    req.params.id,
    {
      title: title,
      category: category,
      date: date,
      amount: amount,
      comment: comment,
    },
    { new: true }
  ).then((newAndUpdatedReceipt) => {
    console.log("This is the updated receipt", newAndUpdatedReceipt);
    res.redirect(`/main/${req.params.id}`);
  });
});

// DELETE RECEIPT
router.get("/:id/delete-receipt", isLoggedIn, (req, res) => {
  const id = req.params.id;
  Receipt.findByIdAndRemove(id)
    .then((deletedReceipt) => {
      console.log("Deleted Receipt:", deletedReceipt);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/overview-receipts");
    });
});

//GET RECEIPT DETAILS
router.get("/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  let pageTitle = "RECEIPT DETAILS";
  Receipt.findById(id)
    .then((receiptDetails) => {
      console.log("Receipt:", receiptDetails);
      res.render("details-receipt", { receiptDetails, pageTitle: pageTitle });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/overview-receipts");
    });
});

module.exports = router;
