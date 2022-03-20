require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
  updateVideogame,
  getVideogame,
} = require("../controllers/videogamesControllers");
const { auth } = require("../middlewares/auth");
const videogamaeJoi = require("../schemas/videogameJoi");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllVideogames);
router.delete("/:videogameId", auth, deleteVideogame);
router.post(
  "/create",
  auth,
  upload.single("image"),
  validate(videogamaeJoi),
  createVideogame
);
router.put(
  "/update/:videogameId",
  auth,
  upload.single("image"),
  updateVideogame
);
router.get("/:videogameId", getVideogame);

module.exports = router;
