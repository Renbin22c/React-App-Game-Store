const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = mongoose.model("Like", LikeSchema, "likes");
