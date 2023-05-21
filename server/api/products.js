const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image/product_image");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    let products = await Product.find()
      .populate("likes.like")
      .populate("comments.comment");
    return res.json(products);
  } catch (e) {
    return res.status(400).json({ e, msg: "Cannot get products" });
  }
});

//GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
      .populate("likes.like")
      .populate("comments.comment");
    return res.json(product);
  } catch (e) {
    return res.status(400).json({ e, msg: "Cannot get product" });
  }
});

// ADD PRODUCT
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.isAdmin) {
      let product = new Product(req.body);
      product.image = "image/product_image/" + req.file.filename;
      // product.video = "video/product_video/" + req.files["video"][0].filename;
      product.save();
      return res.json({ product, msg: "Sucessfully added product" });
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to add product" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

// UPDATE PRODUCT
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ msg: "No product found" });

    if (!req.user.isAdmin)
      return res
        .status(401)
        .json({ msg: "You are not authorized to update this product" });

    const product = await Product.findById(req.params.id);

    let updatedFields = { ...req.body };

    if (req.file) {
      updatedFields.image = "image/product_image/" + req.file.filename;
      const oldImagePath = path.join(__dirname, "../" + product.image);
      fs.unlinkSync(oldImagePath);
    } else {
      updatedFields.image = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    return res.json({
      msg: "Product has been updated",
      product: updatedProduct,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e, msg: "Cannot update this product" });
  }
});

// DELETE PRODUCT
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ msg: "No product found" });

    if (req.user.isAdmin) {
      const product = await Product.findById(req.params.id);
      const imagename = product.image;
      const imagepath = path.join(__dirname, "../" + imagename);
      if (fs.existsSync(imagepath)) fs.unlinkSync(imagepath);
      await Product.findByIdAndDelete(product._id);
      return res.json({ product, msg: "Successfully delete !" });
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to delete product" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;

module.exports = router;
