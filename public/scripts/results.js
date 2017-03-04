$(document).ready(function(){
  var index = $(".value").length;
  var test;
  var winnerIndex = 0;
  var winnerValue = 0;
  $(".container footer").click(".btn-info", function(){
    var text = $(".container footer .btn-info").text();
    $(".container footer .btn-info").remove();
    if (text === "Close Poll"){
      $(".container footer").append(`<button class="btn btn-info">Open Poll</button>`);
    } else {
      $(".container footer").append(`<button class="btn btn-info">Close Poll</button>`);
    }
  })

  for(let i = 1; i <= index; i++){
    test = Number($(`tbody tr:nth-child(${i}) .points`).text());
    if (winnerValue <= test){
      winnerValue = test;
      winnerIndex = i;
      console.log(test);
    }
    console.log(test);
  }
  $(`tbody tr:nth-child(${winnerIndex})`).css("background-color", "yellow");
});