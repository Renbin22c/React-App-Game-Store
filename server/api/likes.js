const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const mongoose = require("mongoose");

router.post("/:productId", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId))
      return res.json({ msg: "No product to show" });

    let product = await Product.findById(req.params.productId);
    let likedProduct = await Like.findOne({
      user: req.user._id,
      product: product._id,
    });

    if (!likedProduct) {
      let liker = new Like({
        user: req.user._id,
        product: req.params.productId,
      });
      liker.save();
      product.likes.push({ like: liker._id });
      product.save();
      return res.json({ msg: "Liked product!" });
    } else {
      await Like.findByIdAndDelete(likedProduct._id);
      await Product.findByIdAndUpdate(
        { _id: req.params.productId },
        {
          $pull: { likes: { like: likedProduct._id } },
        }
      );

      return res.json({ msg: "Unliked product" });
    }
  } catch (e) {
    return res.status(400).json({ e, msg: "Cannot like product" });
  }
});

module.exports = router;
