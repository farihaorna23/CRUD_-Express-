const express = require("express");
const router = express.Router();
const apiRouter = require("./api");
const pageRouter = require("./pages");
//so if url endpoints begins with api, send it to the api router to check for routes there -> it is an api route -> will use api router
//all the api routes will come from the apiRouter folder
router.use("/api", apiRouter);
//if not api, then use the pageRouter
router.use(pageRouter);

module.exports = router;
