const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  videogames: {
    type: [Schema.Types.ObjectId],
    ref: "Videogame",
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
