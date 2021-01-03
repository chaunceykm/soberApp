const express = require("express");
const asyncHandler = require("express-async-handler");
const { check } = require("express-validator");

const {
  handleValidationErrors,
  userIsFound,
  userNotFoundError,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("lastUsed")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("Please enter a valid date"),
  handleValidationErrors,
];

//Sign up
router.post(
  "",
  validateSignup,
  asyncHandler(async (req, res) => {
    const { email, password, username, lastUsed } = req.body;
    //add error handling for existing email or username in database
    const user = await User.signup({ email, username, password, lastUsed });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  })
);

//Retrieve profile information
router.get(
  "/:id(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "lastUsed"],
    });
    if (user) {
      res.json({ user });
    } else {
      next(userNotFoundError(req.params.id));
    }
  })
);

//Edit profile
router.put(
  "/:id(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "lastUsed"],
    });

    if (user) {
      if (req.user.id != user.id) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "You are not authorized to edit this user.";
        err.title = "Unauthorized";
        throw err;
      }
      await user.update({
        username: req.body.username,
        email: req.body.email,
        lastUsed: req.body.lastUsed,
      });
      res.json({ user });
    } else {
      next(userNotFoundError(req.params.id));
    }
  })
);
//Delete profile
router.delete(
  "/:id(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
      if (req.user.id != user.id) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "You are not authorized to delete this user.";
        err.title = "Unauthorized";
        throw err;
      }
      await user.destroy();
      res.json({ message: `Deleted user with id of ${req.params.id}.` });
    } else {
      next(userNotFoundError(req.params.id));
    }
  })
);
module.exports = router;
