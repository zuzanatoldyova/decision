$(document).ready(function(){
  var index = $(".table-inverse tbody tr").length;
  var test;
  var winnerIndex = 0;
  var winnerValue = 0;
  var highlight = 0;
  $(".container footer").on("click", ".btn-info", function(){
    var text = $(".container footer .btn-info").text();
    $(".container footer .btn-info").remove();
    if (text === "Close Poll"){
      $.ajax({
      url: $(location).attr('href'),
      method: 'put',
      data: {"open": false},
      }).then(function(data){
      }).catch(function(err){
          console.log("Can't update poll");
      });
      $(".container footer p").remove();
      $(".container footer").append(`<button class="btn btn-info">Open Poll</button>`);
      $(".container footer").append(`<p style="color:red;">Poll is now closed!</p>`);
    } else {
      $.ajax({
      url: $(location).attr('href'),
      method: 'put',
      data: {"open": true},
      }).then(function(data){
      }).catch(function(err){
          console.log("Can't update poll");
      });
      $(".container footer p").remove();
      $(".container footer").append(`<button class="btn btn-info">Close Poll</button>`);
      $(".container footer").append(`<p style="color:red;">Poll is now open!</p>`);
    }
  })
  console.log(index)
  for(let i = 1; i <= index; i++){
    test = Number($(`tbody tr:nth-child(${i}) .points`).text());
    if (test !== 0 && highlight === 0){
      highlight = 1;
    }
      console.log(winnerValue)
      console.log(test)

    if (winnerValue <= test){
      winnerValue = test;
      winnerIndex = i;
    }
  }
  if (highlight === 1){
    for(let i = 1; i <= index; i++){
      test = Number($(`tbody tr:nth-child(${i}) .points`).text());
      console.log(test);
      console.log(winnerValue);
      if( test === winnerValue){
        console.log
         $(`tbody tr:nth-child(${i})`).css("background-color", "yellow");
      }
    }
  }
});