$(".list-item").mouseover(function() {
    $(this).find(".drop-menu").slideDown(200);
    $(this).find(".list-item a").css("color", "#FFF");
}).mouseleave(function() {
    $(this).find(".drop-menu").slideUp(200);
    $(this).find(".list-item a").css("color", "#000");
});

//#to-top button appears after scrolling
var fixed = false;
$(document).scroll(function() {
    if ($(this).scrollTop() > 250) {
        if (!fixed) {
            fixed = true;
            // $('#to-top').css({position:'fixed', display:'block'});
            $('#to-top').show("slow", function() {
                $('#to-top').css({
                    position: 'fixed',
                    display: 'block'
                });
            });
        }
    } else {
        if (fixed) {
            fixed = false;
            $('#to-top').hide("slow", function() {
                $('#to-top').css({
                    display: 'none'
                });
            });
        }
    }
});

function getTags() {
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/tags',
        type: "GET",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            showTags(response.tags);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("<id=" + i + ">" + "card status:" + ixhr.status);
            console.log("error:" + thrownError);
        }
    });

    function showTags(tags) {
        tags.map(function(tag) {
            let newTag = $('<li class="tag"></li>');
            let tagLink = '/archive?tag=' + tag.tag_name;
            $('<a ></a>').text(tag.tag_name).attr("href", tagLink).appendTo(newTag);
            $('#tag-list').append(newTag);
        });
    }
}

$(document).ready(function() {
    loginCheck();
    getTags();
});



function post_login() {
    var email = $('#email').val();
    var password = $('#password').val();
    var datas = {
        "email": email,
        "password": password
    };
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/login',
        method: "POST",
        dataType: 'json',
        data: datas,
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            if (response.status == 400) {
                $("#checkLogin-btn").attr("data-target", "loginModal-fail");
                $("#checkLogin-btn").click();
            } else{
               localStorage.setItem('voiteUser', JSON.stringify(response.user));
               window.location.reload();
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function post_signup() {

    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var datas = {
        "name": name,
        "email": email,
        "password": password
    };

    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/signup',
        method: "POST",
        dataType: 'json',
        data: datas,
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);
            if (response.status == 200) {
                $("#checkSignup-btn").attr("data-target", "#signupModal-success");
                $("#checkSignup-btn").click();
            } else if (response.status == 400) {
                $("#checkSignup-btn").attr("data-target", "#signupModal-fail");
                $("#checkSignup-btn").click();
                localStorage.setItem('voiteUser', JSON.stringify(response.user));
                window.location.reload();
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function loginCheck(){
  var user = localStorage.getItem('voiteUser');
  user = JSON.parse(user);
  if(user){
    $('#header-personal-container').html("<a href='/profile'>"+ user.name +"</a><button type='button' class='btn-simple' onclick='logout()' >登出</button>");
    $('#header-function-container a').attr('href','/newissue');
  } else{
    $('#header-personal-container').html('<button type="button" class="btn-simple" data-toggle="modal" data-target="#loginModal">登入</button>\
    <button type="button" class="btn-simple" data-toggle="modal" data-target="#signupModal">註冊</button>');
    $('#header-function-container a').attr('data-toggle','modal').attr('data-target','#loginModal');
  }
}

function logout(){
  console.log('logout');
  $.ajax({
      url: 'https://stormy-fjord-31975.herokuapp.com/logout',
      method: "Get",
      dataType: 'json',
      xhrFields: {
          withCredentials: true
      },
      success: function(response) {
          localStorage.removeItem('voiteUser');
          window.location.reload();
      },
      error: function(xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }
  });
}


function carouselSetup(){
  $('.carousel').carousel();
  $(".left").click(function(){
    $("#carousel").carousel("prev");
  });
  $(".right").click(function(){
    $("#carousel").carousel("next");
  });
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadingCardAnimation() {
    let loading = '<div class="loading"></div>';
    $(".card_container").html(loading); // 先將內容改成loading
}
