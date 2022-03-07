require("dotenv").config();
const debug = require("debug")("videogames:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectToMyDataBase = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("returnOriginal", false);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        reject(error);
        return;
      }
      debug(chalk.bold.greenBright(`Database connected`));
      resolve();
    });
  });

module.exports = connectToMyDataBase;
