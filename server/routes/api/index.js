const router = require("express").Router();

const sessionRouter = require("./session");
const userRouter = require("./users");
const journalRouter = require("./journal");
const goalRouter = require("./goal");

router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/journal-entries", journalRouter);
router.use("/goals", goalRouter);

module.exports = router;
