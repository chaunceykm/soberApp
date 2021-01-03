const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  const path = require("path");

  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../client", "build", "index.html")
    );
  });

  router.use(express.static(path.resolve("../client/build")));

  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../client", "build", "index.html")
    );
  });
}

if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.json({});
  });
}

router.get("/welcome", function (req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.send("Welcome to SobrietyToday!");
});

module.exports = router;
