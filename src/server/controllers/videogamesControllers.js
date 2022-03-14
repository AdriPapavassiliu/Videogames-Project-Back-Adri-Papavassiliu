const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const path = require("path");
const fs = require("fs");
const Videogame = require("../../database/models/Videogame");
const firebaseConfig = require("../../utils/firebaseConfig");

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);

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
  try {
    const { body } = req;

    const oldFileName = path.join("uploads", req.file.filename);
    const extension = req.file.originalname.split(".").pop();
    const newFileName = path.join(
      "uploads",
      `${req.body.name}-${Date.now()}.${extension}`
    );
    fs.rename(oldFileName, newFileName, (error) => {
      if (error) {
        next(error);
      }
    });
    fs.readFile(newFileName, async (error, file) => {
      if (error) {
        next(error);
      } else {
        const storageRef = ref(storage, body.name);
        await uploadBytes(storageRef, file);
        const firebaseFileURL = await getDownloadURL(storageRef);
        body.image = firebaseFileURL;
        await Videogame.create(body);

        res.status(201).json({ message: "Videogame created" });
      }
    });
  } catch (error) {
    fs.unlink(path.join("uploads", req.file.filename), () => {
      error.code = 400;
      next(error);
    });
    error.message = "Videogame couldn't be created";
    error.code = 400;
    next(error);
  }
};

module.exports = { getAllVideogames, deleteVideogame, createVideogame };
