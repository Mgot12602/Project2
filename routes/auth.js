const router = require("express").Router();

// ? Package to will handle encryption of password
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Requiring the User model in order to interact with the database
const User = require("../models/User.model");

// Requiring necessary middlewares in order to control access to specific routes
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/signup", shouldNotBeLoggedIn, (req, res) => {
  let pageTitle = "SIGNUP";
  res.render("auth/signup", { pageTitle });
});

router.post("/signup", shouldNotBeLoggedIn, (req, res) => {
  const {
    email,
    password,
    name,
    surname,
    taxId,
    companyName,
    companyAdress,
  } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "Please provide your email" });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "email already exists" });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          email,
          password: hashedPassword,
          name,
          surname,
          taxId,
          companyName,
          companyAdress,
        });
      })
      .then((user) => {
        // binds the user to the session object
        req.session.user = user;
        console.log("You are now registered and logged in");
        return res.redirect("/overview-receipts");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage: "Email used is already registerd",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", shouldNotBeLoggedIn, (req, res) => {
  let pageTitle = "LOGIN";
  res.render("auth/login", { pageTitle });
});

router.post("/login", shouldNotBeLoggedIn, (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your email" });
  }

  //   * Here we use the same logic as above - either length based parameters or we check the strength of a password
  // if (password.length < 8) {
  //   return res.status(400).render("auth/login", {
  //     errorMessage: "Your password needs to be at least 8 characters",
  //   });
  // }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Email does not exist" });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Password is not correct" });
        }
        req.session.user = user;
        console.log("You are now legged in");
        // req.session.user = user._id ! better and safer but in this case we saving the entire user object
        return res.redirect("/overview-receipts");
      });
    })
    .catch((err) => {
      console.log(err);
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.render("auth/login", { infoMessage: "Now you are logged out" });
  });
});

module.exports = router;
