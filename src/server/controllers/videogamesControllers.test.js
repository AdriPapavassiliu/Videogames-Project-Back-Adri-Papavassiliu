const fs = require("fs");
const Videogame = require("../../database/models/Videogame");
const {
  getAllVideogames,
  deleteVideogame,
  createVideogame,
  getVideogame,
  updateVideogame,
} = require("./videogamesControllers");

jest.mock("../../database/models/Videogame");

jest.mock("firebase/storage", () => ({
  getStorage: () => "holaa",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

const newVideogame = {
  name: "Hola",
  platforms: "PS4, XBOX, PS5, PC",
  genre: "Shooter",
  description: "Hola",
  year: 2019,
  id: "1",
};
const newFile = {
  fieldname: "image",
  originalname: "hola.jpeg",
  encoding: "7bit",
  mimetype: "image/jpeg",
  destination: "uploads/",
  filename: "93ec034d18753a982e662bc2fdf9a584",
  path: "uploads/93ec034d18753a982e662bc2fdf9a584",
  size: 8750,
};

describe("Given a getAllVideogames controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a response", () => {
    test("Then it should call method json with a list of videogames", async () => {
      const res = {
        json: jest.fn(),
      };
      const videogames = [
        {
          name: "Apex Legends",
          image: "https://www.xtrafondos.com/descargar.php?id=3030&vertical=1",
          platforms: ["PS4", "XBOX", "PS5", "PC"],
          genre: "Shooter",
          description:
            "A free-to-play strategic battle royale game featuring 60-player matches and team-based play",
          year: 2019,
        },
        {
          name: "GTA V",
          image: "https://www.xtrafondos.com/descargar.php?id=3228&vertical=1",
          platforms: ["PS4", "XBOX", "PS5", "PC"],
          genre: "Action",
          description:
            "An action-adventure game played from either a third-person or first-person perspective. Players complete missions—linear scenarios with set objectives—to progress through the story. Outside of the missions, players may freely roam the open world.",
          year: 2013,
        },
      ];
      Videogame.find = jest.fn().mockResolvedValue(videogames);

      await getAllVideogames(null, res);

      expect(Videogame.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ videogames });
    });
  });
});

describe("Given a deleteVideogame controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a request with the right id", () => {
    test("Then it should call method json with the message 'Videogame deleted'", async () => {
      const message = { message: "Videogame deleted" };
      const req = { params: { videogameId: "1" } };
      const res = {
        json: jest.fn(),
      };

      Videogame.findByIdAndDelete = jest.fn().mockResolvedValue(res.json);
      await deleteVideogame(req, res);

      expect(res.json).toHaveBeenCalledWith(message);
    });
  });
  describe("When it receives a request with a wrong id", () => {
    test("Then it should throw an error 404 with message 'Videogame not found'", async () => {
      const next = jest.fn();
      const error = new Error("Videogame not found");
      error.code = 404;
      const req = { params: { vieogameId: "8888888888888" } };

      Videogame.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      await deleteVideogame(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createVideogame controller", () => {
  describe("When it's instantiated with a new videogame in the body and an image as file", () => {
    test("Then it should call json with the new videogame and the firebase url as image property", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        body: newVideogame,
        file: newFile,
      };
      const next = jest.fn();
      Videogame.create = jest.fn().mockResolvedValue("Hola");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await createVideogame(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new videogame in the body and an image in the file, and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
      const req = {
        body: newVideogame,
        file: newFile,
      };
      const next = jest.fn();

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });

      await createVideogame(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file and no videogame on body", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        file: newFile,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
        callback();
      });

      await createVideogame(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it has an error when renaming the file", () => {
    test("Then it should call the next method with an error", async () => {
      const req = {
        body: newVideogame,
        file: newFile,
      };
      const next = jest.fn();

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      await createVideogame(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getVideogame controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a request with the id", () => {
    test("Then it should call method json with the videogame", async () => {
      const req = { params: { videogameId: "1" } };
      const res = {
        json: jest.fn(),
      };
      const videogame = {
        name: "Apex Legends",
        image: "https://www.xtrafondos.com/descargar.php?id=3030&vertical=1",
        platforms: ["PS4", "XBOX", "PS5", "PC"],
        genre: "Shooter",
        description:
          "A free-to-play strategic battle royale game featuring 60-player matches and team-based play",
        year: 2019,
        id: "1",
      };

      Videogame.findById = jest.fn().mockResolvedValue(videogame);
      await getVideogame(req, res);

      expect(res.json).toHaveBeenCalledWith({ videogame });
    });
  });
});

describe("Given an updateVideogame controller", () => {
  describe("When it's instantiated with a new videogame in the body and an image as file", () => {
    test("Then it should call json with the new videogame and the firebase url as image property", async () => {
      const newViideogame = {
        name: "Hola",
        platforms: "PS4, XBOX, PS5, PC",
        genre: "Shooter",
        description: "Hola",
        year: 2019,
        id: "1",
      };
      const newFille = {
        fieldname: "image",
        originalname: "hola.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        body: newViideogame,
        file: newFille,
        params: "1",
      };
      const next = jest.fn();
      Videogame.create = jest.fn().mockResolvedValue("Hola");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await updateVideogame(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new videogame in the body and an image in the file, and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
      const req = {
        body: newVideogame,
        file: newFile,
        params: "1",
      };
      const next = jest.fn();

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });

      await updateVideogame(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file and no videogame on body", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        file: newFile,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
        callback();
      });

      await updateVideogame(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new videogame in the body and not a file", () => {
    test("Then it should call json with the new videogame", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        body: newVideogame,
        params: "1",
      };
      const next = jest.fn();
      Videogame.create = jest.fn().mockResolvedValue("Hola");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, null);
      });

      await updateVideogame(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
