const Videogame = require("../../database/models/Videogame");
const { getAllVideogames } = require("./videogamesControllers");

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
