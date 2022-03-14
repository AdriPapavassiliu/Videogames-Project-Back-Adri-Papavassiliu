const Videogame = require("../../database/models/Videogame");
const {
  getAllVideogames,
  deleteVideogame,
} = require("./videogamesControllers");

jest.mock("../../database/models/Videogame");

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
