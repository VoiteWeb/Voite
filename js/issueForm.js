$(document).ready(function() {
  getApiTags(tagInputSetup);
});

function getApiTags(next){
  $.ajax({
      url: 'https://stormy-fjord-31975.herokuapp.com/apis/tags',
      type: 'Get',
      dataType: 'json',
      xhrFields: {
          withCredentials: true
      },
      success: function(response) {
          var source = [];
          for(var i=0;i<response.tags.length;i++){
            source[source.length] = response.tags[i].tag_name;
          }
          next(source);
      },
      error: function(xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }
  });
}

function tagInputSetup(source){
  $(':text:not(#title)').tagsinput({
      maxTags: 5,
  });
  var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
          var matches, substringRegex;
          // an array that will be populated with substring matches
          matches = [];
          // regex used to determine if a string contains the substring `q`
          substrRegex = new RegExp(q, 'i');
          // iterate through the pool of strings and for any string that
          // contains the substring `q`, add it to the `matches` array
          $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                  matches.push(str);
              }
          });
          cb(matches);
      };
  };
  $(':text:not(#title)').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
  }, {
      name: 'states',
      source: substringMatcher(source)
  });
}

function sendIssue(event) {
    var data = {};
    console.log($("#tags").tagsinput('items'));
    data.title = $('[name="title"]').val();
    data.category_id = $('[name="category_id"]').val();
    data.duration = $('[name="duration"]').val();
    data.tags_list = $("#tags").tagsinput('items');
    data.introduce = $('[name="introduce"]').val();
    data.reference = $('[name="reference"]').val();
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/issue',
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: data,
        success: function(response) {
            console.log(response);
            document.getElementById("message").innerHTML = '建立成功';
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}
