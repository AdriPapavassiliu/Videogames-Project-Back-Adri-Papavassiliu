const debug = require("debug")("videogames:middlewares:joiValidator");
const VideogameJoiSchema = require("../schemas/VideogameJoiSchema");

const joiValidator = (req, res, next) => {
  const { error: validationError } = VideogameJoiSchema.validate(req);
  if (validationError) {
    debug("found error validating jwt in request header");
    const error = new Error(validationError.details[0].message);
    error.status = 401;
    return next(error);
  }
  debug("validated headers successfully");
  return next();
};

module.exports = joiValidator;
