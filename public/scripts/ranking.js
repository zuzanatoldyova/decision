$(document).ready(function () {
  registerRankingElementChange();
  registerSubmitRanking();
  setOptionsContainerHeight();
  $(window).resize(setOptionsContainerHeight);
});

function setOptionsContainerHeight() {
  var container = $('.section-container.options');
  container.css('height', 'auto');
  container.css('height', (container.css('height')));
}

function registerRankingElementChange() {
  $("#ranked-options").sortable({
    update: onRankedElementsChanged
  });
}

function onRankedElementsChanged(event, ui) {
  var $children = $(this).children();
  $children.each(function (index) {
    $(this).find("span").text(String(index + 1));
  });
}

function registerSubmitRanking() {
  $("#submit-ranking").on('click', function (event) {
    console.log("pressed button");
    onSubmitRanking(event);
  });
}

function onSubmitRanking(event) {
  event.preventDefault();

  var $rankedOptions = $("#ranked-options");
  var $children = $rankedOptions.children();
  var totalCount = 0;
  var name = $(".form-control").val();
  var answers = [];
  $children.each(function (index) {
    totalCount++;
    var curRank = index + 1;
    var curID = Number($(this).attr("data-id"));
    answers.push({
      choice_id: curID,
      name: name
    });
  });
  var bordaCount = totalCount;
  for (var i = 0; i < answers.length; i++) {
    answers[i]["points"] = bordaCount;
    bordaCount--;
  }
  let id = $('.container .droptrue').attr('data-id');
  $.ajax({
    method: "POST",
    url: `/polls/${id}`,
    data: {
      answers
    }
  })
    .done(function (msg) {
      $('<h2 class="emphasize">Thank you for taking the poll! <br> Results Submitted </h2>').replaceAll('#ranked-options').css('text-align', 'center');
      $('#submit-ranking').remove();
      $('.section-container.options header').remove();
      $('.form-control').remove();
      $('.lead').remove();
      $('.section-container.options header h3').text('');
      $('.section-container.options').css('text-align', 'center');
      setOptionsContainerHeight();
    })
    .fail(function (err) {});
}