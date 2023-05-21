const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Storage = require("../models/Storage");
const auth = require("../middleware/auth");
const stripe = require("stripe")(
  "sk_test_51N5KNUIkMqZzPvQ7mdoZ79ovXUEIgLuRIkf0my4rGjrRcdtE4of7dtPjpqZDWWxoCj2X16wqQ7pcB5zqi6wwtcOS00wpXHTlBM"
);

router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const storage = await Storage.findOne({ user: req.user._id });

      if (storage === null) {
        const myStorage = await Storage.create({
          user: req.user._id,
          items: cart.items,
        });

        await myStorage.save();
        await Cart.findByIdAndDelete(cart._id);

        return res.json({ msg: "Check out successfully" });
      }

      if (storage) {
        storage.items.push(...cart.items);
        await storage.save();
        await Cart.findByIdAndDelete(cart._id);

        return res.json({ msg: "Check out su ccessfully" });
      }

      // rest of the code...
    } else {
      return res.json({ msg: "Your cart is empty" });
    }
  } catch (e) {
    return res.json({ msg: "No cart found", e });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let storage = await Storage.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (storage) {
      return res.json(storage);
    } else {
      return res.json({ msg: "No storage found", length: 0 });
    }
  } catch (e) {
    return res.status(400).json({ e, msg: "Error retrieving storage" });
  }
});

module.exports = router;
