const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorageSchema = new Schema({
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
      purchasedAt: { type: Date, default: Date.now },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Storage", StorageSchema, "storages");
