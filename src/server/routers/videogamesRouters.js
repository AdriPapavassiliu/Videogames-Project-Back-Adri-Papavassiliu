require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
} = require("../controllers/videogamesControllers");
const VideogameJoiSchema = require("../schemas/VideogameJoiSchema");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllVideogames);
router.delete("/:videogameId", deleteVideogame);
router.post(
  "/create",
  validate(VideogameJoiSchema),
  upload.single("image"),
  createVideogame
);

module.exports = router;
