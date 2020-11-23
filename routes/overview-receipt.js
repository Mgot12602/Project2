const Receipt = require("../models/Receipt.model");

const router = require("express").Router();

// * Need to check for MY receipts
router.get("/main", isLoggedIn, (req, res) => {
  Receipt.find() // only my receipts
    .sort({ date: -1 })
    //.limit(10)
    //.populate("")
    .then((receipts) => {
      console.log("receipts:", receipts);
      res.render("overview-receipts", { receipts });
    });
});

module.exports = router;
