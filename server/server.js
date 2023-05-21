const express = require("express");
const app = express();
const PORT = 5678;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { DB_HOST, DB_NAME, DB_PORT } = process.env;
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

app.use(cors());
app.use(express.json());
app.use(express.static("image"));

app.use("/users", require("./api/users"));
app.use("/products", require("./api/products"));
app.use("/comments", require("./api/comments"));
app.use("/likes", require("./api/likes"));
app.use("/carts", require("./api/carts"));
app.use("/storages", require("./api/storages"));
// app.use("/storages", require("./api/storages"));

app.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
