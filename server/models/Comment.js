const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String },
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema, "comments");
