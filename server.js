require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./Routes/router");
const path = require("path");
require("./db/connection");

const server = express();

const PORT = process.env.PORT || 5000;

server.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.use(cors());

server.use(express.json());

server.use(router);

server.listen(PORT, () => {
  console.log(`Peak Alpha server started at ${PORT}`);
});

server.get("/", (req, res) => {
  res.send("PEAKALPHA SERVER STARTED....");
});
