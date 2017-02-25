$(function() {
    // 預設顯示第一個 Tab
    var _showTab = 0;
    $('.abgne_tab').each(function() {
        // 目前的頁籤區塊
        var $tab = $(this);

        var $defaultLi = $('ul.tabs li', $tab).eq(_showTab).addClass('active');
        $($defaultLi.find('a').attr('href')).siblings().hide();

        // 當 li 頁籤被點擊時...
        // 若要改成滑鼠移到 li 頁籤就切換時, 把 click 改成 mouseover
        $('ul.tabs li', $tab).click(function() {
            // 找出 li 中的超連結 href(#id)
            var $this = $(this),
                _clickTab = $this.find('a').attr('href');
            // 把目前點擊到的 li 頁籤加上 .active
            // 並把兄弟元素中有 .active 的都移除 class
            $this.addClass('active').siblings('.active').removeClass('active');
            // 淡入相對應的內容並隱藏兄弟元素
            $(_clickTab).stop(false, true).fadeIn().siblings().hide();

            return false;
        }).find('a').focus(function() {
            this.blur();
        });
    });
});

function getIssue_ajax() {
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/issue/585cfb320935491100db70b0',
        method: "GET",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);
            $('#issue-title').text(response.issue.title);
            $('#reference p').text(response.issue.reference);
            $('#issue-introduce p').text(response.issue.introduce);
            $('#days span').text(response.issue.duration);
            $('#votes span').text(response.issue.votes);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function getIssueTitle_ajax() {
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/vote?issue_id=585cfb320935491100db70b0',
        method: "GET",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);

            for (var vote in response.votes) {

                if (response.votes[vote].position == 1) {
                    document.getElementById("agree").innerHTML += '<div class="comment">' + response.votes[vote].reason + '</div>';
                }
                if (response.votes[vote].position == 3) {
                    document.getElementById("neutral").innerHTML += '<div class="comment">' + response.votes[vote].reason + '</div>';
                }
                if (response.votes[vote].position == 2) {
                    document.getElementById("disagree").innerHTML += '<div class="comment">' + response.votes[vote].reason + '</div>';
                }
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function getComments_ajax() {
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/comment?issue_id=585cfb320935491100db70b0',
        method: "GET",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);

            for (var comment in response.comments) {
                //變換icon圖示
                if (response.comments[comment] != null) {
                    document.getElementById("tab1").innerHTML +=
                        '<div id="message' + response.comments[comment]._id + '" class="issue-comment"></div>';
                    //position=1 贊成
                    if (response.comments[comment].position == 1) {
                        document.getElementById("message" + response.comments[comment]._id + "").innerHTML +=
                            '<i class="emo fa fa-thumbs-up"></i>';
                    }
                    //position=2 反對
                    else if (response.comments[comment].position == 2) {
                        document.getElementById("message" + response.comments[comment]._id + "").innerHTML +=
                            '<i class="emo fa fa-thumbs-down"></i>';
                    }
                    //position=3 中立
                    else if (response.comments[comment].position == 3) {
                        document.getElementById("message" + response.comments[comment]._id + "").innerHTML +=
                            '<i class="emo fa fa-circle"></i>';
                    }
                    //印出留言內容及時間
                    document.getElementById("message" + response.comments[comment]._id + "").innerHTML +=
                        '<div class="name">' + response.comments[comment].user_nick + '</div>' +
                        ': <div class="content" id="' + response.comments[comment]._id + '"> ' + response.comments[comment].content + '</div>';

                    document.getElementById("message" + response.comments[comment]._id + "").innerHTML +=
                        '<div class="timestamp">' + response.comments[comment].createdAt + '</div>' +
                        '<br>';

                    //如果是自己的留言，就出現按鈕可以編輯跟刪除
                    if (response.user_id == response.comments[comment].user_id) {
                        $("#message" + response.comments[comment]._id).children('.fa').before('<i data-comment-id=' + response.comments[comment]._id + ' class="fa fa-pencil-square-o comment-edit-icon" aria-hidden="true"></i>');
                        document.getElementById("message" + response.comments[comment]._id).innerHTML +=
                            '<ul class="btn-list"><li class="comment-btn" id="' + response.comments[comment]._id + '" onClick="showEditSpace(this.id);">編輯...</li>\
                            <li class="comment-btn" id="delete-btn" data-comment-id = ' + response.comments[comment]._id + ' onClick="delComment_ajax(this);">刪除...</li></ul>';
                    }

                }
            }
            // 點擊編輯icon後顯示編輯/刪除按鈕
            $('.comment-edit-icon').each(function(index) {
                $(this).on("click", function() {
                    $(this).siblings('.btn-list').show();
                });
            });
            //檢查是否為登入
            if (response.auth == 0) {
                //沒登入的話彈出叫你登入的視窗
                $("#sentComment-btn").attr("data-target", "#myModal-notLogin");
                $("#launch-button").attr("data-toggle","modal").attr("data-target","#loginModal");
            } else if (response.auth == 1) {
                //有登入的話彈出留言視窗
                $("#sentComment-btn").attr("data-target", "#myModal");
                $("#launch-button").attr("href","/newissue");
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}




function postComments_ajax(datas) {
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/comment',
        method: "POST",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: datas,

        success: function(response) {
            console.log(response);
            //document.getElementById("message").innerHTML += response.content;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function messageGo() {
    var issue_id = getParameterByName('id');
    var message = $('#newMessage').val();
    var position = document.getElementById("comment-position").value;
    var input = {
        "issue_id": issue_id,
        "position": position,
        "content": message,
    };
    postComments_ajax(input);
}


function setPosition(icon){
  document.getElementById("comment-position").value = ({
    agree: 1,
    disagree: 2,
    neutral: 3,
  }[icon.id] || '');
  $('.icon').css("border","5px solid transparent");
  icon.style.border = "5px solid #ffc832";
}


function putComment_ajax(button) {
    var id = button.getAttribute("data-comment-id");
    var putMes = $('#putMessage').val();
    //var putMes = '345';
    var datas = {
        "issue_id": '585cfb320935491100db70b0',
        "position": 1,
        "content": putMes,
    };

    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/comment/' + id,
        method: "PUT",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: datas,

        success: function(response) {
            console.log(response);
            $('#edit-form').remove();
            $('#' + id).text(putMes);
            $('#' + id).show();

        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function delComment_ajax(button) {
    $('.btn-list').hide();
    var id = button.getAttribute("data-comment-id");
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/comment/' + id,
        method: "DELETE",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);
            window.location.reload();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

// 新增編輯留言輸入框
function showEditSpace(id) {
    $('.content').show();
    $('#edit-form').remove();
    $('.btn-list').hide();
    $('#' + id).hide();
    console.log($('#' + id).text());
    $('#' + id).after('<form id="edit-form" class="edit-form"><input type="text" class="" id="putMessage" value=' + $('#' + id).text() + '>');
    $('#putMessage').after("<button id='submit' data-comment-id=" + id + " class='submit-btn' onClick='putComment_ajax(this);'>送出</button><span class='link-text' data-comment-id=" + id + " onClick='hideEditSpace(this)'>取消</span</form>");
}

// 取消編輯留言動作
function hideEditSpace(button) {
    var id = button.getAttribute("data-comment-id");
    $('#edit-form').remove();
    $('#' + id).show();
}

// 點擊編輯按鈕列表以外的地方就隱藏編輯按鈕列表
$(document).mouseup(function(e) {
    var container = $('.btn-list');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});

window.addEventListener("load", getIssueTitle_ajax());
//window.addEventListener("load", messageGo());
window.addEventListener("load", getComments_ajax());
window.addEventListener("load", getIssue_ajax());





// 投票功能
function checkoption(obj) {
    var click = document.getElementById(obj);
    click.style.color = "#ffc832";
    var my_position;
    if (obj == "vote-yes") {
        document.getElementById("vote-neutral").style.color = "#000000";
        document.getElementById("vote-no").style.color = "#000000";
        my_position = "1"; //立場為贊成
    } else if (obj == "vote-neutral") {
        document.getElementById("vote-yes").style.color = "#000000";
        document.getElementById("vote-no").style.color = "#000000";
        my_position = "2"; //立場為中立
    } else if (obj == "vote-no") {
        document.getElementById("vote-yes").style.color = "#000000";
        document.getElementById("vote-neutral").style.color = "#000000";
        my_position = "3"; //立場為反對
    }
    document.getElementById("position").value = my_position;
}

function sendVote() {
    var issue_id = getParameterByName('id');
    var my_reason = document.getElementById("reason").value; //取得理由內容
    var my_position = document.getElementById("position").value;
    $.ajax({
        url: 'https://stormy-fjord-31975.herokuapp.com/apis/vote',
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: {
            issue_id: issue_id,
            position: my_position,
            reason: my_reason
        },
        success: function(response) {
            console.log(response);
            document.getElementById("message").innerHTML = response.err;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}
