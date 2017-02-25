
function getProfile(){
  $.ajax({
    url: 'https://stormy-fjord-31975.herokuapp.com/apis/user',
    type: "GET",
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    success: function(response) {
      console.log('user: '+response.user.identity);
      if(!response.user.infoAuth){
        window.location.href = '/settings?id='+ response.user.user_id;
      } else {
        fillProfile(response.user);
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log("<id=" + i + ">" + "card status:" + ixhr.status);
      console.log("error:" + thrownError);
    }
  });
}

function fillProfile(user){
  $('#profile-box').append('\
    <li>信箱： '+ user.email     +'</li>\
    <li>出生： '+ user.birth     +'</li>\
    <li>性別： '+ user.gender    +'</li>\
    <li>身份： '+ user.identity  +'</li>');

  $('#profile-box').append(({
    students: fillStudents(user),
    members: fillMembers(user),
    alumnus: fillAlumnus(user),
  }[ user.identity ] || ''));

  var mailAuth = (user.mailAuth&&"<span class='label label-success'>郵件驗證已通過</span>")||"<span class='label label-warning'> 郵件尚未驗證!</span><li>需驗證郵件才可投票!</li>";
  if(user.mailAuth&&!user.facebook){
    mailAuth+='&nbsp<a href="https://stormy-fjord-31975.herokuapp.com/connect/facebook" class="btn btn-primary">連結Facebook</a>'
  }
  $('#profile-box').append(mailAuth);

  function fillStudents(user){
    var html = '\
    <li>院別： '+  user.students.college     + '</li>\
    <li>系別： '+  user.students.department  + '</li>\
    <li>級別： '+  user.students.grade       + '</li></ul>';
    return html;
  }

  function fillMembers(user){
    var html = '\
    <li>單位：'+ user.department +'</li>\
    <li>年資：'+ user.seniority +'</li>';
    return html;
  }

  function fillAlumnus(user){
    var html = '\
    <li>院別：   '+  user.college    + '</li>\
    <li>系別：   '+  user.department + '</li>\
    <li>級別：   '+  user.grade      + '</li>\
    <li>現職領域：'+  user.profession + '</li>';
    return html;
  }

}


$(document).ready(function(){
  getProfile();
});
