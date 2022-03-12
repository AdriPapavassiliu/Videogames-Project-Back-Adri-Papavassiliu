require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("..");
const connectDB = require("../../database");
const Videogame = require("../../database/models/Videogame");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectDB(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newVideogame = {
    name: "Apex Legends",
    image: "https://www.xtrafondos.com/descargar.php?id=3030&vertical=1",
    platforms: ["PS4", "XBOX", "PS5", "PC"],
    genre: "Shooter",
    description:
      "A free-to-play strategic battle royale game featuring 60-player matches and team-based play",
    year: 2019,
    id: "621546e7e9a6b0aac4560b1f",
  };
  await Videogame.create(newVideogame);
});

afterEach(async () => {
  await Videogame.deleteMany({});
});

describe("Given a /videogames endpoint", () => {
  describe("When it receives a GET request", () => {
    test("Then it should respond with status 200 and have property videogames", async () => {
      const expectedProperty = "videogames";
      const url = "/videogames";

      const { body } = await request(app).get(url).expect(200);

      expect(body).toHaveProperty(expectedProperty);
    });
  });
});

describe("Given a /:videogameId endpoint", () => {
  describe("When it receives a DELETE request", () => {
    test("Then it should respond with status 200 and message 'Videogame deleted'", async () => {
      const expectedReturn = { message: "Videogame deleted" };
      const url = "/videogames/621546e7e9a6b0aac4560b1f";

      const { body } = await request(app).delete(url).expect(200);

      expect(body).toEqual(expectedReturn);
    });
  });
});
