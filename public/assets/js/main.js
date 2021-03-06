// event listeners
$(document).ready(function() {
  $(document).on("click", ".scrape", scrape);
  $(document).on("click", ".save", save);
  $(document).on("click", ".notes", notes);
  $(document).on("click", ".add", add);
});

// scrape new articles
function scrape() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function() {
    alert("Scrape finished.");
  }).fail(function() {
    alert("Scrape failed.");
  }).always(function () {
    window.location.replace("/");
  });
}

// add article to saved articles
function save() {
  var article = $(this).data("article");
  var newSaved = !$(this).data("saved");
  var newSavedState = {
    saved: newSaved
  }
  $.ajax({
    method: "PUT",
    url: "/save/" + article,
    data: newSavedState
  }).always(function() {
    window.location.replace(window.location.href);
  });
}

// get article notes
function notes() {
  var article = $(this).data("article");
  $.ajax({
    method: "GET",
    url: "/notes/" + article
  }).then(function(data) {
    $("#articleModalLabel").text(data.article);
    showArticles(data);
  });
}

// add article note
function add() {
  var article = $("#articleModalLabel").text();
  var note = $("#comment").val().trim();
  $.ajax({
    method: "POST",
    url: "/notes/add/" + article,
    data: {
      note: note
    }
  }).then(function(data) {
    showArticles(data);
    $("#comment").val("");
  });
}

// display articles
function showArticles(data) {
  $("#notes").text("");
  data.notes.forEach(function(item) {
    $("#notes").append(item.note);
  });
}