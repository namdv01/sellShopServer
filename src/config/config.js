const express = require("express");
const dotenv = require("dotenv");

const config = (app) => {
  dotenv.config();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(express.static("./src/public"));
  // app.use(express.static("src/public"));
};

module.exports = config;
