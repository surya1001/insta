const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;
const requireLogin = require("../middlewares/requireLogin");

router.get("/", (req, res) => {
  res.send("Hello auth");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello user");
});

router.post(
  "/signup",
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter valid email"),
  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password should be atleast 6 characters"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be atleast 3 characters "),
  (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ error: "Please fill all the required fields" });
    }

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ error });
    }

    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(422).json({ error: "User already exists" });
        } else {
          bcrypt
            .hash(password, 12)
            .then((hashedpassword) => {
              const user = new User({
                name,
                email,
                password: hashedpassword,
              });
              user
                .save()
                .then((user) => {
                  return res.json({ message: "User Signedup successfully" });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please enter email and password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email } = savedUser;
            return res.status(200).json({
              token,
              user: {
                _id,
                name,
                email,
              },
            });
          } else {
            return res.status(422).json({ error: "Invalid email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
