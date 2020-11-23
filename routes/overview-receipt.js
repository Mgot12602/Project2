const Receipt = require("../models/Receipt.model");

const router = require("express").Router();

// * Need to check for MY receipts
router.get("/", isLoggedIn, (req, res) => {
  Receipt.find()
    .sort({ date: -1 })
    .limit(10)
    //.populate("")
    .then((receipts) => {
      console.log("posts:", receipts);
      res.render("overview-receipts", { receipts });
    });
});

module.exports = router;
