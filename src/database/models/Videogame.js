const { model, Schema } = require("mongoose");

const VideogameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  platforms: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
});

const Videogame = model("Videogame", VideogameSchema, "videogames");

module.exports = Videogame;
