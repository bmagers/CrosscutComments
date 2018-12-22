// server
var express = require("express");
var app = express();
var PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, function() {
  console.log("Server listening on http://localhost:" + PORT);
});

// view engine
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes
var routes = require("./controllers/routes");
app.use(routes);

// logger
var logger = require("morgan");
app.use(logger("dev"));

// database
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var db = require("./models");