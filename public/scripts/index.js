function questionSubmit(){
    var input = $(".container article header input").val();
    if (input.length < 140 && input.replace(/\s+/g, "").length !== 0){
      $(".container article header input").remove();
      $(".container article header span").remove();
      $(".container article header a").text(input);
      $(".container article main").slideDown( "slow", function() {});
      $(".container article footer").slideDown( "slow", function() {});
    }
    if (input.length >= 140){
      alert("Max Characters of 140");
    }
    if (input.replace(/\s+/g, "").length === 0){
      alert("Please input some values");
    }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

$(document).ready(function(){
  var newSection = `<section class="input">
          <div class="form-group">
            <label>Title</label>
            <input class="form-control" placeholder="Title">
            </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="3"></textarea>
          </div>
          </section>`;
  $(".container article main").slideUp( "fast", function() {});

  $(".container article footer").slideUp( "fast", function() {});

  $(".container article header button").click( function(){
    questionSubmit();
  });

  $(".container article header input").keydown(function(event) {
      if (event.keyCode == 13) {
        $(".container article header button").click();
      }
  });

  // $(".container article header input").keydown(function(event) {
  //     if (event.keyCode == 13) {
  //       $(".container article footer .form button").click();
  //     }
  // });
  // $(".container article main input").keydown(function(event) {
  //     if (event.keyCode == 13) {
  //       $(".container article header button").click();
  //     }
  // });


  $(".container article footer .form button:nth-child(2)").click(function(){
    if ($(".container article main section").length > 1){
      $(".container article main section").first().remove();
    }
  });

  $(".container article footer .form button").first().click(function(){
    $(".container article main").prepend(newSection);
  });

  $(".container article footer .submit button").click(function(){
    var choicesLength = $(".container article main section").length;
    var choices = [];
    var title;
    var description;
    var data = {};
    var email = $(`.container article footer input`).val();
    if(!validateEmail(email)){
      alert("Enter a valid email!");
      return;
    }
    for(let i = 1; i <= choicesLength; i++){
      title = $(`.container article main section:nth-child(${i}) input`).val();
      description = $(`.container article main section:nth-child(${i}) textarea`).val()
      if(title.replace(/\s+/g, "").length === 0){
        alert("One or more title options is empty!");
        return;
      }
      choices[i-1] = {"title": title, 'description': description};
    }
    data = { "email": email,
      'question': $(".container article header a").text(),
      'choices': choices
    }
      $.ajax({
      url: '/polls',
      method: 'POST',
      data: data,
      }).then(function(data){
        console.log(data);
      }).catch(function(err){
          console.log("Can't get links");
      });
  });
});