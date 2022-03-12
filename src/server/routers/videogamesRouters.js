require("dotenv").config();
const express = require("express");
const {
  getAllVideogames,
  deleteVideogame,
} = require("../controllers/videogamesControllers");

const router = express.Router();

router.get("/", getAllVideogames);
router.delete("/:videogameId", deleteVideogame);

module.exports = router;
