var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
  // get articles from the database and render them to index
  res.render("index", { data: "root route hooked up" });
});

module.exports = router;