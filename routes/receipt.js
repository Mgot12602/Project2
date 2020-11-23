const Receipt = require("../models/Receipt.model");
const router = require("express").Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

// * NEEDS AUTHENTICATED USER
router.get("/new-post", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("new-post");
});

module.exports = router;
