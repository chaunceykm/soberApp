const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

router.get("/welcome", function (req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.send("Welcome to SobrietyToday!");
});

module.exports = router;
