const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { default: helmet } = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const videogamesRouters = require("./routers/videogamesRouters");
const usersRouters = require("./routers/usersRouters");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));

app.use("/user", usersRouters);
app.use("/videogames", videogamesRouters);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
