require("dotenv").config();
const debug = require("debug")("twitter:root");
const initializeServer = require("./server/initializeServer");
const app = require("./server/index");
const connectToMyDataBase = require("./database");

const port = process.env.PORT || 4000;
const databaseConnect = process.env.MONGODB_URI;

(async () => {
  try {
    await initializeServer(port, app);
    await connectToMyDataBase(databaseConnect);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
