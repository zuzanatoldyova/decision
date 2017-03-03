function questionSubmit(){
    var input = $(".container article header input").val();
    if (input.length < 140 && input.replace(/\s+/g, "").length !== 0){
      $(".container article header input").remove();
      $(".container article header span").remove();
      $(".container article header a").text(input);
      $(".container article main").slideDown( "slow", function() {});
      $(".container article footer").slideDown( "slow", function() {});
      $(".container article section input").first().focus();
      $(".container article header .alert-danger").remove();
    }
    if (input.length >= 140){
      $(".container article .input-group input").css("border-color", "red");
      if(!$(".container article header .alert-danger").length){
        $(".container article header").append(`<div class="alert alert-danger" role="alert">
  <a>Max Characters of 140</a></div>`);
      }
    }
    if (input.replace(/\s+/g, "").length === 0){
      $(".container article .input-group input").css("border-color", "red");
      if(!$(".container article header .alert-danger").length){
        $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>Please input some values</a>
          </div>`);
      }
    }
}

function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
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
      if (event.keyCode === 13) {
        $(".container article header button").click();
      }
  });

  $(".container article main").keydown("input", function(event) {
      if (event.keyCode === 13) {
        $(".container article footer .form button").first().click();
      }
  });
  $(".container article footer input").keydown(function(event) {
      if (event.keyCode === 13) {
        $(".container article footer .submit button").click();
      }
  });


  $(".container article footer .form button:nth-child(2)").click(function(){
    if ($(".container article main section").length > 1){
      $(".container article main section").last().remove();
    }
  });

  $(".container article footer .form button").first().click(function(){
    $(".container article main").append(newSection);
    $(".container article section input").last().focus();
  });

  $(".container article footer .submit button").click(function(){
    var choicesLength = $(".container article main section").length;
    var choices = [];
    var titles = [];
    var title;
    var description;
    var descriptions = [];
    var data = {};
    var count = 0;
    var email = $(`.container article footer input`).val();
    if(!validateEmail(email)){
      if(!$(".container article header .alert-danger").length){
        $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>Enter Valid Email</a>
          </div>`);
      }
      return;
    }
    for(let i = 1; i <= choicesLength; i++){
      title = $(`.container article main section:nth-child(${i}) input`).val();
      description = $(`.container article main section:nth-child(${i}) textarea`).val();
      if(title.replace(/\s+/g, "").length === 0){
        if(description.replace(/\s+/g, "").length !== 0){
          alert("You are missing a title");
          return;
        }
        count++;
      } else {
        titles.push(title);
        choices[i - 1 - count] = {"choice_title": title, 'description': description};
      }
    }
    if(hasDuplicates(titles)){
      if(!$(".container article header .alert-danger").length){
        $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>You have duplicate inputs</a>
          </div>`);
      }
      return;
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
        var admin_link = data.admin;
        var voting_link =data.user;
        var linkshtml = `<div class="links"><a href="/polls/${admin_link}/results">Admin Link</a>
        <a href="/polls/${voting_link}">Voter Link</a></div>`;
        $(".container article header").remove();
        $(".container article main").remove();
        $(".container article footer").remove();
        $(".container article").prepend(linkshtml);
      }).catch(function(err){
          console.log("Can't get links");
      });
  });
});