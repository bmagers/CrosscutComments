var express = require("express");
var router = express.Router();
var db = require("../models");

// scrape articles
router.get("/scrape", function(req, res) {
  var cheerio = require("cheerio");
  var axios = require("axios");
  var count = 0;
  axios.get("https://crosscut.com/articles").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      var article = $(element).attr("data-history-node-id");
      var headline = $(element).find("h2").text().replace(/^\s+|\s+$/g, '');
      var summary = $(element).find(".field--name-field-article-teaser").text();
      var url = $(element).find("h2").find("a").attr("href");
      var date = $(element).find(".month-day-year-date").text();

      if (article && headline && summary && url && date) {
        db.Article.create({
          article: article,
          headline: headline,
          summary: summary,
          url: url,
          date: date
        }).then(function(dbResult) {
          count++;
        }).catch(function(error) {
          if (error) { console.log(error); }
        });
      }

    });
    res.status(200).end();
  });
});

// get articles from database
router.get("/", function(req, res) {
  db.Article.find({})
  .then(function(data) {
    var hbsObject = {
      articles: data
    };
    res.render("index", hbsObject);
  }).catch(function(error) {
    res.json(error);
  });
});

// get notes
router.get("/notes/:article", function(req, res) {
  console.log("getting article " + req.params.article);
  db.Article.findOne({
    article: req.params.article
  }).then(function(data) {
    console.log("found it!");
    var hbsObject = {
      article: data.article,
      headline: data.headline
    };
    console.log(hbsObject);
    // res.render("index", hbsObject);
    res.json(hbsObject);
  }).catch(function(error) {
    console.log(error);
  });
});

// get saved articles from database
router.get("/saved", function(req, res) {
  db.Article.find({
    saved: true
  })
  .then(function(data) {
    var hbsObject = {
      articles: data
    };
    res.render("index", hbsObject);
  }).catch(function(error) {
    res.json(error);
  });
});

// update saved state
router.put("/save/:article", function(req, res) {
  db.Article.findOneAndUpdate(
    { article: req.params.article },
    { $set: { saved: req.body.saved } }
  ).then(function(data) {
    res.status(200).end();
  }).catch(function(error) {
    console.log(error);
  });
})

module.exports = router;