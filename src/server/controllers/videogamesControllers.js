const Videogame = require("../../database/models/Videogame");

const getAllVideogames = async (req, res) => {
  const videogames = await Videogame.find();
  res.json({ videogames });
};

module.exports = { getAllVideogames };
