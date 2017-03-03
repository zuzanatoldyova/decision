$(document).ready(function(){
  var index = $(".value").length;
  var test;
  var winnerIndex = 0;
  var winnerValue = 0;
  $(".container footer .btn-info").click(function(){
    $(".container footer .btn-info").remove();
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