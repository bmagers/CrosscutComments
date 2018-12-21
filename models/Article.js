var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  article: {
    type: String,
    unique: true
  },
  headline: {
    type: String
  },
  teaser: {
    type: String
  },
  url: {
    type: String
  },
  date: {
    type: String
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;