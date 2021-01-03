const router = require("express").Router();

const sessionRouter = require("./session");
const userRouter = require("./users");
const journalRouter = require("./journal");

router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/journal", journalRouter);

module.exports = router;
