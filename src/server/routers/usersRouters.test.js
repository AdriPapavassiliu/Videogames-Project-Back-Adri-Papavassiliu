require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const databaseConnect = require("../../database");
const User = require("../../database/models/User");
const Videogame = require("../../database/models/Videogame");
const app = require("../index");

let database;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const connectionString = database.getUri();

  await databaseConnect(connectionString);
});

afterAll(() => {
  mongoose.connection.close();
  database.stop();
});

beforeEach(async () => {
  await User.create({
    name: "gini",
    username: "gini",
    password: "$2b$10$KJBw85d2lseR5CY8/QA6reYsohmb0P.sA0sYMjnDDU7cxrpMsZ6GW",
  });

  await User.create({
    name: "user2",
    username: "user2",
    password: "user2",
  });

  await Videogame.create({
    name: "Apex Legends",
    image: "https://www.xtrafondos.com/descargar.php?id=3030&vertical=1",
    platforms: ["PS4"],
    genre: "Shooter",
    description:
      "A free-to-play strategic battle royale game featuring 60-player matches and team-based play",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with a correct username and correct password", () => {
    test("Then it should return a token", async () => {
      const user = {
        username: "gini",
        password: "gini",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it recevies a POST request with a wrong username", () => {
    test("Then it should respond with a 404 and a message 'User not found'", async () => {
      const user = {
        username: "afsjkdl",
        password: "gini",
      };
      const expectedError = {
        error: true,
        message: "User not found",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(404);

      expect(body).toHaveProperty("error", expectedError.message);
    });
  });

  describe("When it recevies a POST request with a wrong password", () => {
    test("Then it should respond with a 401 and message 'Wrong password'", async () => {
      const user = {
        username: "gini",
        password: "fdasjo",
      };
      const expectedError = {
        error: true,
        message: "Wrong password",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(401);

      expect(body.error).toBe(expectedError.message);
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When it receives a request with a POST method and a new user on the body", () => {
    test("Then it should respond with a 201 status and the new user", async () => {
      const newUser = {
        username: "vini",
        name: "vini",
        password: "vini",
      };

      const { body } = await request(app)
        .post("/user/register")
        .send(newUser)
        .expect(201);

      expect(body).toHaveProperty("username", newUser.username);
    });
  });
});
