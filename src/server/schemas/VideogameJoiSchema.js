const Joi = require("joi");

const VideogameJoiSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(17).required(),
  genre: Joi.string().required(),
  platforms: Joi.array().items(Joi.string().min(2).max(16)).required(),
  description: Joi.string().alphanum().min(3).max(300).required(),
  image: Joi.string().required(),
  year: Joi.number(),
});

export default VideogameJoiSchema;
