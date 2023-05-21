const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: Boolean, default: false },
  developer: { type: String, required: true },
  publisher: { type: String, required: true },
  image: { type: String },
  video: { type: String, required: true },
  release_time: { type: String, required: true },
  comments: [
    {
      comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
      _id: false,
    },
  ],

  likes: [
    {
      like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
      _id: false,
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

module.exports = mongoose.model("Product", ProductSchema, "products");
