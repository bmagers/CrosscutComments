var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var port = 3000;
var db = require("./models");
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var cheerio = require("cheerio");
var axios = require("axios");

for (var i = 0; i < 20; i++) {
  console.log(" ");
}

function trimNewlines(input) {
  return input.replace(/^\s+|\s+$/g, '');
}

axios.get("https://crosscut.com/articles").then(function(response) {
  var $ = cheerio.load(response.data);
  var results = [];
  var count = 0;
  $("article").each(function(i, element) {
    var article = $(element).attr("data-history-node-id");
    var headline = trimNewlines($(element).find("h2").text());
    var teaser = $(element).find(".field--name-field-article-teaser").text();
    var url = $(element).find("h2").find("a").attr("href");
    var date = $(element).find(".month-day-year-date").text();
    // var byline = trimNewlines($(element).find(".byline").find(".authored-by").text().replace("by ",""));

    if (headline && teaser && url && date) {
      results.push({
        article: article,
        headline: headline,
        teaser: teaser,
        url: url,
        date: date
      });
      count++;
    }

  });
  console.log(results);
  console.log("count = " + count);
});
