const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  image: { type: String, default: null },
  gender: { type: String, required: false, default: null },
  introduce: { type: String, required: false, default: null },
  country: { type: String, required: false, default: null },
  birthday: { type: String, required: false, default: null },
});

module.exports = mongoose.model("User", UserSchema, "users");
