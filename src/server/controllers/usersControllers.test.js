require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const User = require("../../database/models/User");
const connectToMyDatabase = require("../../database/index");

const Videogame = require("../../database/models/Videogame");
const { loginUser, createUser } = require("./usersControllers");

jest.mock("../../database/models/User");

let database;
let token;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await connectToMyDatabase(uri);
  jest.resetAllMocks();
});

let registeredUsername;
let registeredPassword;

beforeEach(async () => {
  registeredUsername = "adri";
  registeredPassword = await bcrypt.hash("adri", 3);
  const userDataToken = {
    username: registeredUsername,
  };
  token = jwt.sign(userDataToken, process.env.JWT_SECRET);

  await User.create({
    name: registeredUsername,
    username: registeredUsername,
    password: registeredPassword,
    videogames: {},
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

afterAll(() => {
  mongoose.connection.close();
  database.stop();
});

describe("Given a loginUser controller", () => {
  describe("When it receives a request with a correct username and password", () => {
    test("Then it should return a token", async () => {
      const password = "adri";
      const user = {
        username: registeredUsername,
        password,
      };
      const userData = {
        username: registeredUsername,
        password: registeredPassword,
      };

      User.findOne = jest.fn().mockResolvedValue(userData);
      jwt.sign = jest.fn().mockReturnValue(token);
      const req = {
        body: user,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: user.username });
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives a request with a wrong username and correct password", () => {
    test("Then it should return a 404 status with an error", async () => {
      const user = {
        password: "adri",
      };

      const req = {
        body: user,
      };
      const next = jest.fn();
      const expectedError = new Error("User not found");
      expectedError.code = 404;

      User.findOne = jest.fn().mockResolvedValue(user.username);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a correct username and wrong password", () => {
    test("Then it should return a 401 status with an error", async () => {
      const user = {
        username: "adri",
        password: "1234",
      };
      const req = {
        body: user,
      };
      const next = jest.fn();
      const expectedError = new Error("Wrong password");
      expectedError.code = 401;
      bcrypt.compare = jest.fn().mockResolvedValue();
      User.findOne = jest.fn().mockResolvedValue(user.username);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createUser controller", () => {
  describe("When it receives a request without password", () => {
    test("Then it should return a 404 status with an error", async () => {
      const user = {
        name: "adri",
        username: "adri",
      };

      const req = {
        body: user,
      };
      const next = jest.fn();
      const expectedError = new Error("Please fill the blank fields");
      expectedError.code = 400;

      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with name, repeated username and password", () => {
    test("Then it should return a 409 status with an error", async () => {
      const user = {
        name: "juan",
        username: "adri",
        password: "1234",
      };
      const req = {
        body: user,
      };
      const next = jest.fn();
      const expectedError = new Error("Username already taken");
      expectedError.code = 409;

      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
