const express = require("express");
const morgan = require("morgan");
const path = require("path");
const router = require("./routes/index.js");
const app = express();

app.use(router);

//when the doesn't exist
app.use((req, res, next) => {
  try {
    //read the file and send the file to the client
    //set the status to 404
    res.status(404).sendFile(path.join(__dirname, "./public/notFound.html"));
  } catch (err) {
    //if there is an error while reading the file, pass the error to the next middleware function
    //middleware function will handle it
    next(err);
  }
});

//server error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "A an error has occured in the server" }, err);
});

app.listen(3000, () => {
  console.log("Server running...");
});
