// server
var express = require("express");
var app = express();
var PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes
var routes = require("./controllers/htmlRoutes.js");
app.use(routes);

// logger
var logger = require("morgan");
app.use(logger("dev"));

// database
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var db = require("./models");

// scraping applications
var cheerio = require("cheerio");
var axios = require("axios");

axios.get("https://crosscut.com/articles").then(function(response) {
  var $ = cheerio.load(response.data);
  var results = [];
  var count = 0;
  $("article").each(function(i, element) {
    var article = $(element).attr("data-history-node-id");
    var headline = $(element).find("h2").text().replace(/^\s+|\s+$/g, '');
    var summary = $(element).find(".field--name-field-article-teaser").text();
    var url = $(element).find("h2").find("a").attr("href");
    var date = $(element).find(".month-day-year-date").text();

    if (article && headline && summary && url && date) {
      results.push({
        article: article,
        headline: headline,
        summary: summary,
        url: url,
        date: date
      });
      count++;
    }

  });
  // console.log(results);
  console.log("count = " + count);
});

app.listen(PORT, function() {
  console.log("Server listening on http://localhost:" + PORT);
});