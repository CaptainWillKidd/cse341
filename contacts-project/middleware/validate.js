const { validationResult } = require("express-validator");
 
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //Everything is ok, keep moving
  }
 
  //IF exists errors
  return res.status(422).json({
    success: false,
    message: "Validation faild",
    errors: errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    })),
  });
};