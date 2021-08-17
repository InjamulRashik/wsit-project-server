const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const PORT = 5000;

const customMiddleware = (req, res, next) => {
  next();
};

mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => {
  console.log("Conection with Mongo Done!");
});

app.use(customMiddleware);

app.get("/", customMiddleware, (req, res) => {
  console.log("Check");
  res.send("Working");
});

app.listen(PORT, () => {
  console.log("Server is running", PORT);
});
