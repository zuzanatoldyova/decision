function questionSubmit() {
  var input = $(".container article header input").val();
  if (input.length < 140 && input.replace(/\s+/g, "").length !== 0) {
    $(".container article header .input-group").remove();
    $(".container article header span").remove();
    $(".container article header a").text(input);
    $(".container article main").slideDown("slow", function () {});
    $(".container article aside").slideDown("slow", function () {});
    $(".container article footer").slideDown("slow", function () {});
    $(".container article section input").first().focus();
    $(".container article header .alert-danger").remove();
  }
  if (input.length >= 140) {
    $(".container article .input-group input").css("border-color", "red");
    $(".container article header .alert-danger").remove();
    $(".container article header").append(`<div class="alert alert-danger" role="alert">
  <a>Max Characters of 140</a></div>`);
    window.scrollTo(0, 0);
  }
  if (input.replace(/\s+/g, "").length === 0) {
    $(".container article .input-group input").css("border-color", "red");
    $(".container article header .alert-danger").remove();
    $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>Please input some values</a>
          </div>`);
    window.scrollTo(0, 0);
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

$.fn.focusScrolling = function () {
  var pos = this.position();
  this.focus();
  window.scrollTo(pos.left, pos.top);
};

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function intialState() {
  $(".container article header input").focus();
  $(".container article main").slideUp("fast");
  $(".container article footer").slideUp("fast");
  $(".container article aside").slideUp("fast");
}

function enterProgression() {
  var newSection = `<section class="input">
          <div class="form-group title">
            <label>Title</label>
            <input class="form-control" placeholder="Title">
            </div>
          <div class="form-group description">
            <label>Description (Optional)</label>
            <textarea class="form-control" rows="1"></textarea>
          </div>
          </section>`;
  $(".container article header input").keydown(function (event) {
    if (event.keyCode === 13) {
      $(".container article header button").click();
    }
  });

  $(".container .email textarea").keydown(function (event) {
    if (event.keyCode === 13) {
      $(".container article footer input").focus();
    }
  });
  $(".container .phone textarea").keydown(function (event) {
    if (event.keyCode === 13) {
      $(".container .email textarea").focus();
    }
  });

  $(".container article main").keydown("input", function (event) {
    if (event.keyCode === 13) {
      $(".container article footer .form button").first().click();
    }
  });
  $(".container article footer input").keydown(function (event) {
    if (event.keyCode === 13) {
      $(".container article footer .submit button").click();
    }
  });

  $(".container article footer .form button:nth-child(2)").click(function () {
    if ($(".container article main section").length > 1) {
      $(".container article main section").last().remove();
    }
  });

  $(".container article footer .form button").first().click(function () {
    $(".container article main").append(newSection);
    $(".container article section input").last().focusScrolling();
  });
}

function checkValidPhone(invitesPhones) {
  var result = [];
  for (let i = 0; i < invitesPhones.length; i++) {
    if (!isNaN(invitesPhones[i])) {
      if (invitesPhones[i].length === 10) {
        result.push(Number(invitesPhones[i]) + 10000000000);
      }
      if (invitesPhones[i].length === 11) {
        if (Math.floor((Number(invitesPhones[i]) / 10000000000)) === 1) {
          result.push(Number(invitesPhones[i]));
        }
      }
    }
  }
  return result;
}

function checkValidEmails(invites) {
  var result = [];
  for (let i = 0; i < invites.length; i++) {
    if (validateEmail(invites[i])) {
      result.push(invites[i]);
    }
  }
  return result;
}

$(document).ready(function () {
  intialState();
  $(".container article header button").click(function () {
    questionSubmit();
  });
  enterProgression();
  $(".container article footer .submit button").click(function () {
    var choicesLength = $(".container article main section").length;
    var choices = [];
    var titles = [];
    var title;
    var description;
    var descriptions = [];
    var data = {};
    var count = 0;
    var invites = $(".container .email textarea").val();
    var validEmails;
    var email = $(".container article footer input").val();
    var invitesPhones = $(".container .phone textarea").val();
    var validNumbers;
    var length = 0;
    for(let i = 1; i <= choicesLength; i++){
      if($(`.container article main section:nth-child(${i}) input`).val().replace(/\s+/g, "") !== ''){
        length++;
      }
    }
    if ( length <= 1) {
      $(".container article header .alert-danger").remove();
      $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>You only have one option</a>
          </div>`);
      window.scrollTo(0, 0);
      return;
    }


    if (!validateEmail(email)) {
      $(".container article header .alert-danger").remove();
      $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>Enter Valid Email</a>
          </div>`);
      window.scrollTo(0, 0);
      return;
    }
    for (let i = 1; i <= choicesLength; i++) {
      title = $(`.container article main section:nth-child(${i}) input`).val();
      description = $(`.container article main section:nth-child(${i}) textarea`).val();
      if (title.replace(/\s+/g, "").length === 0) {
        if (description.replace(/\s+/g, "").length !== 0) {
          $(".container article header .alert-danger").remove();
          $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>You are mising a Title</a>
          </div>`);
          window.scrollTo(0, 0);
          return;
        }
        count++;
      } else {
        titles.push(title);
        choices[i - 1 - count] = {
          "choice_title": title,
          'description': description
        };
      }
    }
    if (hasDuplicates(titles)) {
      $(".container article header .alert-danger").remove();
      $(".container article header").append(`<div class="alert alert-danger" role="alert">
          <a>You have duplicate inputs</a>
          </div>`);
      window.scrollTo(0, 0);
      return;
    }
    invites = invites.replace(/\s+/g, "").split(",");
    validEmails = checkValidEmails(invites);
    invitesPhones = invitesPhones.replace(/\s+/g, "").replace(/-/g, "").split(",");
    validNumbers = checkValidPhone(invitesPhones);
    $(".container article header .alert-danger").remove();
    data = {
      "email": email,
      'question': $(".container article header a").text(),
      'email_invite': validEmails,
      'sms_invite': validNumbers,
      'choices': choices
    };
    $.ajax({
      url: '/polls',
      method: 'POST',
      data: data
    }).then(function (data) {
      var admin_link = data.admin;
      var voting_link = data.user;
      var linkshtml = `<div class="question"><h6>Here are your links:</h6></div><div class="links"><a href="${admin_link}" target="_blank">Admin Link</a>
        <a href="${voting_link}" target="_blank">Voter Link</a></div><div class="links"><form action="http://localhost:8080/">
    <input type="submit" class="btn btn-info button" value="New Poll" />
</form></div>`;
      $(".container article header").remove();
      $(".container article main").remove();
      $(".container article aside").remove();
      $(".container article footer").remove();
      $(".container article").prepend(linkshtml);
    }).catch(function (err) {
      console.log("Can't get links");
    });


  });
});