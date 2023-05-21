const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      subtotal: { type: Number, required: true },
      _id: false,
    },
  ],
  total: { type: Number },
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
