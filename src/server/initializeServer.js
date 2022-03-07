const debug = require("debug")("videogames:server:initializeServer");

const initializeServer = (port, app) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(`Server listening on http://localhost:${port}`);
      resolve();
    });

    server.on("error", (error) => {
      const errorMessage = `Couldn't start the server.${
        error.code === "EADDRINUSE" ? ` Port ${port} in use` : ""
      }`;
      reject(new Error(errorMessage));
    });
  });

module.exports = initializeServer;
