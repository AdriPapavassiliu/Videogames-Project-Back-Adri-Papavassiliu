const { Joi } = require("express-validation");

const videogamaeJoi = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    genre: Joi.string().required(),
    platforms: Joi.string().min(2).required(),
    description: Joi.string().min(3).max(300).required(),
    image: Joi.string(),
    year: Joi.number(),
  }),
};

module.exports = videogamaeJoi;
