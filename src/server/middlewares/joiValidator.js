const debug = require("debug")("videogames:middlewares:joiValidator");
const VideogameJoiSchema = require("../schemas/VideogameJoiSchema");

const joiValidator = (req, res, next) => {
  const { error: validationError } = VideogameJoiSchema.validate(req.body);
  if (validationError) {
    debug("joi validation");
    const error = new Error(validationError.details[0].message);
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = joiValidator;
