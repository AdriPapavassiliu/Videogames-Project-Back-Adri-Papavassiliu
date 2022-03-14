const { Joi } = require("express-validation");

const VideogameJoiSchema = Joi.object({
  name: Joi.string().min(3).max(17).required(),
  genre: Joi.string().required(),
  platforms: Joi.string().min(2).required(),
  description: Joi.string().min(3).max(300).required(),
  image: Joi.string(),
  year: Joi.number(),
});

module.exports = VideogameJoiSchema;
