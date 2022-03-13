require("dotenv").config();
const express = require("express");
const {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
} = require("../controllers/videogamesControllers");

const router = express.Router();

router.get("/", getAllVideogames);
router.delete("/:videogameId", deleteVideogame);
router.post("/create", createVideogame);

module.exports = router;
