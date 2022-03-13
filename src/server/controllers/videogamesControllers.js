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

const createVideogame = async (req, res, next) => {
  const { name, genre, platforms, description, image, year } = req.body;
  if (!name || !genre || !platforms || !description || !image) {
    const error = new Error("Please fill the blank fields");
    error.code = 400;
    next(error);
    return;
  }
  try {
    await Videogame.create({
      name,
      genre,
      platforms,
      description,
      image,
      year,
    });
    res.status(201).json({ message: "Videogame created" });
  } catch (error) {
    error.message = "Videogame couldn't be created";
    error.code = 400;
    next(error);
  }
};

module.exports = { getAllVideogames, deleteVideogame, createVideogame };
