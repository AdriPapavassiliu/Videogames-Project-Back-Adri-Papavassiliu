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

const createVideogame = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      const { body } = req;
      body.platforms = body.platforms.split(",");
      const oldFileName = path.join("uploads", req.file.filename);
      const extension = req.file.originalname.split(".").pop();
      const newFileName = path.join(
        "uploads",
        `${req.body.name}-${Date.now()}.${extension}`
      );
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
          resolve();
        }
      });
      fs.readFile(newFileName, async (error, file) => {
        if (error) {
          next(error);
          resolve();
        } else {
          const storageRef = ref(storage, body.name);
          await uploadBytes(storageRef, file);
          const firebaseFileURL = await getDownloadURL(storageRef);
          body.image = firebaseFileURL;
          const videogameCreated = await Videogame.create(body);

          res.status(201).json({
            message: "Videogame created",
            videogame: videogameCreated,
          });
          resolve();
        }
      });
    } catch (error) {
      fs.unlink(path.join("uploads", req.file.filename), () => {
        error.code = 400;
        next(error);
        resolve();
      });
      error.message = "Videogame couldn't be created";
      error.code = 400;
      next(error);
      resolve();
    }
  });

const updateVideogame = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      if (req.file) {
        const { body } = req;
        const { videogameId } = req.params;
        body.platforms = body.platforms.split(",");

        const oldFileName = path.join("uploads", req.file.filename);
        const extension = req.file.originalname.split(".").pop();
        const newFileName = path.join(
          "uploads",
          `${req.body.name}-${Date.now()}.${extension}`
        );
        fs.rename(oldFileName, newFileName, (error) => {
          if (error) {
            next(error);
            resolve();
          }
        });

        fs.readFile(newFileName, async (error, file) => {
          if (error) {
            next(error);
            resolve();
          } else {
            const storageRef = ref(storage, body.name);
            await uploadBytes(storageRef, file);

            const firebaseFileURL = await getDownloadURL(storageRef);
            body.image = firebaseFileURL;
            const updatedVideogame = await Videogame.findByIdAndUpdate(
              videogameId,
              body,
              {
                new: true,
              }
            );

            res.status(200).json(updatedVideogame);
            resolve();
          }
        });
      } else {
        (async () => {
          const { body } = req;
          const { videogameId } = req.params;

          const updatedVideogame = await Videogame.findByIdAndUpdate(
            videogameId,
            body,
            {
              new: true,
            }
          );

          res.status(200).json({
            message: "Videogame updated",
            videogame: updatedVideogame,
          });
          resolve();
        })();
      }
    } catch (error) {
      fs.unlink(path.join("uploads", req.file.filename), () => {
        error.code = 400;
        next(error);
        resolve();
      });
      error.message = "Videogame couldn't be updated";
      error.code = 400;
      next(error);
      resolve();
    }
  });

const getVideogame = async (req, res) => {
  const { videogameId } = req.params;
  const videogame = await Videogame.findById(videogameId);
  res.json({ videogame });
};

module.exports = {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
  updateVideogame,
  getVideogame,
};
