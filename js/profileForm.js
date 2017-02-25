$(document).ready(function() {
    formSetup();
});
var formSetup = function() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    for (var i = year; i > 1920; i--) {
        $('#birth').append('<option value="' + i + '">' + i + '</option>');
    }
    for (var i = year - 1911 + 3; i > 0; i--) {
        $('#grade').append('<option value="' + i + '">' + i + '</option>');
        $('#alumnus-grade').append('<option value="' + i + '">' + i + '</option>');
    }
    $('.subForm').hide();
    $('#students').show();
    $('#identity').change(function() {
        $('.subForm').hide();
        $('#' + this.value).show();
    });
    var college = {
        'E0': {
            'E1': '機械系 ME',
            'N1': '機械所 ME',
            'E3': '化工系 CHE',
            'N3': '化工所 CHE',
            'E4': '資源系 RE',
            'N4': '資源所 RE',
            'E5': '材料系 MSE',
            'N5': '材料所 MSE',
            'E6': '土木系 CE',
            'N6': '土木所 CE',
            'E8': '水利系 HOE',
            'N8': '水利所 HOE',
            'NC': '自災所 iNHM',
            'E9': '工科系 ES',
            'N9': '工科所 ES',
            'F0': '能源學程 IBPE',
            'P0': '能源學程',
            'F1': '系統系 SNME',
            'P1': '系統所 SYS',
            'F4': '航太系 AA',
            'P4': '航太所 AA',
            'Q4': '民航所 CA',
            'F5': '環工系 EV',
            'P5': '環工所 EV',
            'F6': '測量系 GM',
            'P6': '測量所 GM',
            'F9': '醫工系 BME',
            'P8': '醫工所 BME',
            'N0': '工程管理 EM',
            'NA': '海事所 OTMA',
            'NB': '尖端所 icam'
        }
    };
    for (var college_number in college) {
        for (var department in college[college_number]) {
            $('#department').append('<option value=' + department + '>' + college[college_number][department] + '</option>');
        }
    };
}

function updatePersonalProfile(event) {
    var user_id = getParameterByName('id');
    var data = {};
    data.withCredentials = true;
    data.country = $('[name="country"]').val();
    data.birth = $('[name="birth"]').val();
    data.gender = $('[name="gender"]').val();
    data.identity = $('[name="identity"]').val();
    data.college = $('[name="college"]').val();
    data.department = $('[name="department"]').val();
    data.grade = $('[name="grade"]').val();
    var route = 'https://stormy-fjord-31975.herokuapp.com/apis/user/' + user_id;
    console.log(route);
    axios.put(route, data)
        .then(function(res) {
            console.log(res);
            document.getElementById("message").innerHTML = '更新成功';
        })
        .catch(function(err) {
            console.log(err);
        });
}

function sendAuthMail() {
    var route = '/apis/user/mailAuth';
    var data = {};
    data.email = $('[name="email"]').val();
    axios.post(route, data)
        .then(function(res) {
            console.log(res);
            document.getElementById("mailMessage").innerHTML = '驗證郵件已寄出';
        })
        .catch(function(err) {
            console.log(err);
        });
}


//
// <% if (!user.mailAuth) { %>
//   <form action="">
//     <div class="form-group">
//       <label>再次送出驗證Email</label>
//       <input type="text" class="form-control" name="email">
//     </div>
//     <p id="mailMessage"></p>
//     <button class="btn waves-effect waves-light" onclick="sendAuthMail(); return false;">送出郵件</button>
//   </form>
//   <% } %>
