require("dotenv").config();
const express = require("express");
// const { validate } = require("express-validation");
const multer = require("multer");
const {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
} = require("../controllers/videogamesControllers");
// const videogamaeJoi = require("../schemas/videogameJoi");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllVideogames);
router.delete("/:videogameId", deleteVideogame);
router.post("/create", upload.single("image"), createVideogame);

module.exports = router;
