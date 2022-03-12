const Videogame = require("../../database/models/Videogame");

const getAllVideogames = async (req, res) => {
  const videogames = await Videogame.find();
  res.json({ videogames });
};

const deleteVideogame = async (req, res, next) => {
  const { videogameId } = req.params;
  try {
    await Videogame.findByIdAndDelete(videogameId);
    res.json({ message: "Videogame deleted" });
  } catch (error) {
    error.code = 404;
    error.message = "Videogame not found";
    next(error);
  }
};

module.exports = { getAllVideogames, deleteVideogame };
