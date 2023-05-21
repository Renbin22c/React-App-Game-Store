const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image/user_image");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let atposition = email.indexOf("@");
    let dotposition = email.lastIndexOf(".");
    if (
      atposition < 1 ||
      dotposition < atposition + 2 ||
      dotposition + 2 >= email.length
    )
      return res.status(400).json({ msg: "Invalid email format" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exist" });

    if (username.length < 3)
      return res
        .status(400)
        .json({ msg: "Username should be at least 3 characters" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password should be at least 8 characters" });

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    let newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    newUser.save();
    return res.json({ newUser, msg: "Registered successfully" });
  } catch (e) {
    return res.json({ error: e });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    else {
      try {
        let token = jwt.sign({ data: user }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.json({ token, user });
      } catch (e) {
        return res.status(400).json({ error: e, msg: "Unable to login" });
      }
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: req.file ? "image/user_image/" + req.file.filename : user.image,
    });

    return res
      .status(200)
      .json({ msg: "Updated Succesfully", user: updateUser });
  } catch (e) {
    return res.status(400).json({ error: e, msg: "Unable to update" });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    return res.json(user);
  } catch (e) {
    return res.status(400).json({ e, msg: "Canoot get user" });
  }
});

router.get("/", async (req, res) => {
  try {
    let users = await User.find();
    return res.json(users);
  } catch (e) {
    return res.status(400).json({ e, msg: "Cannot get users" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const user = await User.findById(req.params.id);
      await User.findByIdAndDelete(user._id);
      await Comment.deleteMany({ user: user });
      await Like.deleteMany({ user: user });
      return res.json({ user, msg: "Successfully delete !" });
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to delete user" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
