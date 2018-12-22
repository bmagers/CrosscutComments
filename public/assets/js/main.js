$(document).ready(function() {
  $(document).on("click", ".scrape", scrape);
  $(document).on("click", ".save", save);
});

function scrape() {
  $.ajax({
    url: "/scrape",
    type: "GET"
  }).done(function() {
    alert("Scrape complete.");
  }).fail(function() {
    alert("Scrape failed.");
  });
}

function save() {
  var article = $(this).data("article");
  var newSaved = !$(this).data("saved");
  var newSavedState = {
    saved: newSaved
  }
  $.ajax("/save/" + article, {
    type: "PUT",
    data: newSavedState
  });

}