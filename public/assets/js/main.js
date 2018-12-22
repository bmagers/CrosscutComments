$(document).ready(function() {
  $(document).on("click", ".scrape", scrape);
  $(document).on("click", ".save", save);
  $(document).on("click", ".notes", notes);
});

function scrape() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    alert("Scrape finished.");
  }).fail(function() {
    alert("Scrape failed.");
  }).always(function () {
    window.location.replace("/");
  });
}

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

function notes() {
  var article = $(this).data("article");
  $.ajax({
    method: "GET",
    url: "/notes/" + article
  }).then(function(data) {
    $("#articleModalLabel").html("Comments for article " + data.article + ":<br>" + data.headline);
  });
}