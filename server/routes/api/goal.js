const express = require("express");
const asyncHandler = require("express-async-handler");
const { requireAuth } = require("../../utils/auth.js");

const { User, Goal } = require("../../db/models");
const { userNotFoundError } = require("../../utils/validation.js");
const { Op } = require('sequelize');

const router = express.Router();

//error handling
const goalNotFound = (id) => {
  const err = Error("Goal not found.");
  err.errors = [`Goal with id of ${id} could not be found`];
  err.title = "Goal not found";
  err.status = 404;
  return err;
};

//create Goal goal

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { goalText, isCompleted } = req.body;
    const goal = await Goal.create({
      userId: req.user.id,
      goalText,
      isCompleted,
    });
    res.json({ goal });
  })
);

//get all goals by user
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user) {
      const goals = await User.findByPk(userId, {
        include: {
          model: Goal,
          as: "goals",
          order: [["createdAt", "ASC"]],
        },
      });
      res.json({ goals });
    } else {
      next(userNotFoundError(userId));
    }
  })
);

//get specific goal
router.get(
  "/:goalId(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const goalId = req.params.goalId;
    const goal = await Goal.findByPk(goalId);
    if (goal) {
      res.json({ goal });
    } else {
      next(goalNotFound(goalId));
    }
  })
);

//update goal
router.put(
  "/:goalId(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const goalId = req.params.goalId;
    const goal = await Goal.findByPk(goalId);
    if (req.user.id !== goal.userId) {
      //Checks if user is signed in and can edit their own goal
      const err = new Error("Unauthorized");
      err.status = 401;
      err.message = "You are not authorized to edit this goal.";
      err.title = "Unauthorized";
      throw err;
    }
    if (goal) {
      await goal.update({
        goalText: req.body.goalText,
        isCompleted: req.body.isCompleted,
      });
      res.json({ goal });
    } else {
      next(goalNotFound(goalId));
    }
  })
);

//delete goal
router.delete(
  "/:goalId(\\d+)",
  requireAuth,
  asyncHandler(
    asyncHandler(async (req, res, next) => {
      const goalId = req.params.goalId;
      const goal = await Goal.findByPk(goalId);
      if (req.user.id !== goal.userId) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "You are not authorized to delete this goal";
        err.title = "Unauthorized";
        throw err;
      }
      if (goal) {
        await goal.destroy();
        res.json({ goal });
      } else {
        next(goalNotFound(goalId));
      }
    })
  )
);

module.exports = router;
