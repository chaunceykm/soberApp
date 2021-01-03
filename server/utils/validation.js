const { validationResult } = require('express-validator')

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => `${error.msg}`)

        const err = Error('Bad request')
        err.errors = errors;
        err.status = 400
        err.title = 'Bad request'
        next(err)
    }
    next(0)
}

const userNotFoundError = (id) => {
    const err = Error("User not found");
    err.errors = [`User with id of ${id} could not be found.`];
    err.title = "User not found.";
    err.status = 404;
    return err;
  };
  
  const userIsFound = (type) => {
    const err = Error('User found')
    err.errors = [`The following ${type} has already been taken.`];
    err.title = "User found";
    return err;
  }
module.exports = {
    handleValidationErrors, userNotFoundError, userIsFound
}