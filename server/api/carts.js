const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Storage = require("../models/Storage");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

//GET CART
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (cart && cart.items.length > 0) return res.json(cart);
    return res.json({ msg: "Your cart is empty" });
  } catch (e) {
    return res.json({ e, msg: "No cart found" });
  }
});

//ADD CART
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) return res.json({ msg: "You cannot shop" });
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const cart = await Cart.findOne({ user: req.user._id });

    const storage = await Storage.findOne({ user: req.user._id });

    if (storage) {
      const storageItem = storage.items.find(
        (item) => item.product == productId
      );
      if (storageItem) {
        return res.json({ msg: "You already have this game in storage" });
      }
    }
    //IF CART IS EMPTY
    if (cart === null) {
      const myCart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            subtotal: product.price,
          },
        ],
        total: product.price,
      });

      await myCart.save();
      return res.json({ msg: "Product added to cart successfully", myCart });
    }

    if (cart) {
      const foundItem = cart.items.find((item) => item.product == productId);
      if (foundItem) {
        return res.json({ msg: "You already add into cart", cart });
      } else {
        cart.items.push({
          product: productId,
          subtotal: product.price,
        });
        cart.total += product.price;
      }
      await cart.save();
      return res.json({ msg: "Added to cart successfully", cart });
    }
  } catch (e) {
    return res.json({ e, msg: "Cannot add to cart" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ msg: "No such product exist" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart.items.length) return res.json({ msg: "No product to delete" });

    cart.items = cart.items.filter((item) => item.product != req.params.id);
    let total = 0;
    cart.items.map((p) => (total += p.subtotal));
    cart.total = total;
    await cart.save();
    return res.json({ msg: "Cart item deleted", cart });
  } catch (e) {
    return res.json({ e, msg: "Cannot delete cart item" });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart.user != req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await Cart.findByIdAndDelete(cart._id);

    return res.json({ msg: "Cart deleted successfully", cart });
  } catch (e) {
    return res.json({ e, msg: "Cannot delete cart" });
  }
});

module.exports = router;
