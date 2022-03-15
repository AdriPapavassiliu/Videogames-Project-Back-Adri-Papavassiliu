const { Joi } = require("express-validation");

const videogamaeJoi = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
    genre: Joi.string(),
    platforms: Joi.string().min(2),
    description: Joi.string().min(3).max(300),
    image: Joi.string(),
    year: Joi.number(),
  }),
};

module.exports = videogamaeJoi;
