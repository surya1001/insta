const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res
      .status(401)
      .json({ error: "You must be logged in to access this page" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You must be logged in to access this page" });
    }

    const { _id } = payload;
    User.findById(_id)
      .then((userData) => {
        userData.password = undefined;
        req.user = userData;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
