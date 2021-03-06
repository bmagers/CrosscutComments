var express = require("express");
var router = express.Router();
var db = require("../models");

// scrape articles
router.get("/scrape", function(req, res) {
  var cheerio = require("cheerio");
  var axios = require("axios");
  axios.get("https://crosscut.com/articles").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      var article = $(element).attr("data-history-node-id");
      var headline = $(element).find("h2").text().replace(/^\s+|\s+$/g, '');
      var summary = $(element).find(".field--name-field-article-teaser").text();
      var url = $(element).find("h2").find("a").attr("href");
      var date = $(element).find(".month-day-year-date").text();
      db.Article.create({
        article: article,
        headline: headline,
        summary: summary,
        url: url,
        date: date
      });
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

// get notes
router.get("/notes/:article", function(req, res) {
  db.Article.findOne({
    article: req.params.article
  }).populate("notes").then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(error) {
    console.log(error);
  });
});

// post note to database
// note: posting the note replaces the existing note, instead of adding to the array of notes
// this is coded exactly like week 18, activity 18, yet behaves differently, and I'm stumped as to
// why the difference in behavior
router.post("/notes/add/:article", function(req, res) {
  var article = req.params.article;
  var note = req.body;
  db.Note.create(note)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate(
      { article: article },
      { notes: dbNote._id },
      { new: true }
    );
  }).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(error) {
    console.log(error);
  });
});

// delete note
// to do after figuring out how to save more than one article at a time

module.exports = router;