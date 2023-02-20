const express = require("express");
const path = require("path");
const router = express.Router();

//request handlers
//send files to the clients according to their routes

router.get("/", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../../public/home.html"));
  } catch (err) {
    //if files can't be read -> server error
    //send error to the next middleware function that handles server error
    next(err);
  }
});

router.get("/about", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../../public/about.html"));
  } catch (err) {
    //if files can't be read -> server error
    //send error to the next middleware function that handles server error
    next(err);
  }
});

router.get("/info", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../../public/info.html"));
  } catch (err) {
    //if files can't be read -> server error
    //send error to the next middleware function that handles server error
    next(err);
  }
});

module.exports = router;
