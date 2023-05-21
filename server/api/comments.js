const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const mongoose = require("mongoose");

router.get("/:productId", async (req, res) => {
  try {
    let comments = await Comment.find({
      product: req.params.productId,
    }).populate("user");
    return res.json(comments);
  } catch (e) {
    return res.status(400).json({ msg: "Cannot get comments" });
  }
});

//ADD
router.post("/:productId", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.json({ msg: "This product doesn't exist" });
    }

    let comment = await Comment.create({
      content: req.body.content,
      product: req.params.productId,
      user: req.user._id,
    });

    let product = await Product.findById(req.params.productId);
    product.comments.push({ comment: comment._id });
    await product.save();
    return res.json({ msg: "Comment added successfully" });
  } catch (e) {
    return res.json({ e, msg: "Cannot comment on this product" });
  }
});

//UPDATE COMMENT
router.put("/:id", auth, async (req, res) => {
  try {
    let currentComment = await Comment.findById(req.params.id);

    if (!currentComment) return res.json({ msg: "No comment found" });
    if (currentComment.user != req.user._id)
      return res.status(401).json({ msg: "Unauthorized" });

    let comment = await Comment.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ msg: "Comment updated successfully", comment });
  } catch (e) {
    return res.json({ e, msg: "Cannot update post" });
  }
});

//DELETE COMMENT
router.delete("/:id", auth, async (req, res) => {
  try {
    let currentComment = await Comment.findById(req.params.id);

    if (!currentComment) return res.json({ msg: "No comment found" });
    if (currentComment.user != req.user._id)
      return res.status(401).json({ msg: "Unauthorized" });

    let comment = await Comment.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Comment deleted successfully", comment });
  } catch (e) {
    return res.json({ e, msg: "Cannot delete comment" });
  }
});

module.exports = router;
