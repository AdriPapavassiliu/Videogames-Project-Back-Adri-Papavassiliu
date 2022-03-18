require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("..");
const connectDB = require("../../database");
const User = require("../../database/models/User");
const Videogame = require("../../database/models/Videogame");

let mongoServer;
let token;
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

  await User.create({
    name: "name",
    username: "user1",
    password: "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
    movies: {},
  });

  const userDataToken = {
    username: "user1",
  };

  token = jwt.sign(userDataToken, process.env.JWT_SECRET);

  await User.create({
    name: "user2",
    username: "user2",
    password: "user2",
    movies: {},
  });
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

      const { body } = await request(app)
        .delete(url)
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toEqual(expectedReturn);
    });
  });
});
