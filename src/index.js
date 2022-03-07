require("dotenv").config();
const debug = require("debug")("twitter:root");
const initializeServer = require("./server/initializeServer");
const app = require("./server/index");

const port = process.env.PORT || 4000;

(async () => {
  try {
    await initializeServer(port, app);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
