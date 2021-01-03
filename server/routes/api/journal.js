const express = require("express");
const asyncHandler = require("express-async-handler");
const { requireAuth } = require("../../utils/auth.js");

const { User, Journal } = require("../../db/models");
const { userNotFoundError } = require("../../utils/validation.js");

const router = express.Router();

//error handling
const entryNotFound = (id) => {
  const err = Error("Journal Entry not found.");
  err.errors = [`Journal Entry with id of ${id} could not be found`];
  err.title = "Journal Entry not found";
  err.status = 404;
  return err;
};

//create Journal entry

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { mood, headline, text } = req.body;
    const journalEntry = await Journal.create({
      userId: req.user.id,
      mood,
      headline,
      text,
    });
    res.json({ journalEntry });
  })
);

//get all Journal entries by user
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user) {
      const userEntries = await User.findByPk(userId, {
        include: {
          model: Journal,
          as: "entries",
          order: [["createdAt", "ASC"]],
        },
      });
      res.json({ userEntries });
    } else {
      next(userNotFoundError(userId));
    }
  })
);

//get specific Journal entry
router.get(
  "/:entryId(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const entryId = req.params.entryId;
    const entry = await Journal.findByPk(entryId);
    if (entry) {
      res.json({ entry });
    } else {
      next(entryNotFound(entryId));
    }
  })
);

//update Journal entry
router.put(
  "/:entryId(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const entryId = req.params.entryId;
    const entry = await Journal.findByPk(entryId);
    if (req.user.id !== entry.userId) {
      //Checks if user is signed in and can edit their own entry
      const err = new Error("Unauthorized");
      err.status = 401;
      err.message = "You are not authorized to edit this entry.";
      err.title = "Unauthorized";
      throw err;
    }
    if (entry) {
      await entry.update({
        mood: req.body.mood,
        headline: req.body.headline,
        text: req.body.text,
      });
      res.json({ entry });
    } else {
      next(entryNotFound(entryId));
    }
  })
);

//delete Journal entry
router.delete(
  "/:entryId(\\d+)",
  requireAuth,
  asyncHandler(
    asyncHandler(async (req, res, next) => {
      const entryId = req.params.entryId;
      const entry = await Journal.findByPk(entryId);
      if (req.user.id !== entry.userId) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "You are not authorized to delete this entry";
        err.title = "Unauthorized";
        throw err;
      }
      if (entry) {
        await entry.destroy();
        res.json({ entry });
      } else {
        next(entryNotFound(entryId));
      }
    })
  )
);

module.exports = router;
