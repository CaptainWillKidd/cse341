const { checkSchema, param } = require("express-validator");
 
// Validación para crear o actualizar un contacto
const saveContactRules = checkSchema({
  firstName: {
    in: ["body"],
    notEmpty: { errorMessage: "firstName is required" },
    isString: { errorMessage: "firstName must be a string" },
  },
  lastName: {
    in: ["body"],
    notEmpty: { errorMessage: "lastName is required" },
    isString: { errorMessage: "lastName must be a string" },
  },
  email: {
    in: ["body"],
    notEmpty: { errorMessage: "email is required" },
    isEmail: { errorMessage: "email must be valid" },
  },
  favoriteColor: {
    in: ["body"],
    notEmpty: { errorMessage: "favoriteColor is required" },
    isString: { errorMessage: "favoriteColor must be a string" },
  },
  birthday: {
    in: ["body"],
    optional: true, // no es obligatorio
    isString: { errorMessage: "birthday must be a string" },
  },
});
 
// Validación del parámetro :id
const idParamRule = [param("id").isMongoId().withMessage("Invalid contact ID")];
 
module.exports = { saveContactRules, idParamRule };