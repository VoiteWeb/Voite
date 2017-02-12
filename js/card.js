
// 需要再修正的地方:
// 1. 剩下天數在剩下個位數天數時(數字放大時)會擠到上面bar的版面
// 	->暫時先將各位數剩餘天數字體設為一樣了，之後再想辦法
// 2. bar的"贊成"與"反對"的字樣在動畫時會跟著跑(雖然這樣子看起來是還不錯看0_0)

// --- 顯示卡片 --- 

let daysLeft = 7;
let amountOfCard = 4;
// For the animation of the progress bars. In ms.
let delayInterval = 500;	
let animationPeriod = 600;

let cardHTML = '<!-- Card Picture -->\
				<div class="card_picture transition"></div>\
				<!-- Title -->\
				<h2 class="title transition">您覺得車管會收300元合理嗎?</h2>\
				<!-- Description -->\
				<p class="transition card_content">車證工本費僅50元，但車管會一學期車證費卻收到300元... </p>\
				<!-- Vote Rate Bar -->\
				<div class="rateBar">\
  					<div class="agreeBar"></div>\
  					<div class="disagreeBar"></div>\
	  				<span class="agreeText">贊成</span>\
  					<span class="disagreeText">反對</span>\
				</div>\
				<!-- Status -->\
				<div class="status_bar">\
					<p class="days_left">還剩Err天</p>\
					<p class="right_corner_text">\
						<i class="fa fa-check-square-o" aria-hidden="true">  Err  </i>\
						<i class="fa fa-comment" aria-hidden="true">  Err  </i> \
					</p>\
				</div>';


function generateCard( amount_of_card ) {

	// 產生每個卡片的模板
	for(let i=0; i<amount_of_card; i++) {
		let card = document.createElement("div");
		// Set up the id and the class of the card
		$(card)
		.attr("id", "card"+i )
		.addClass("card transition")
		.html(cardHTML);
		

		// append the card to the card container
		$(".card_container").append(card);
	}
}

function randomNum( min, max) {
	if(min > max) {
		let temp = min;
		min = max;
		max = temp;
	}
	return Math.floor( (max-min+1) * Math.random() + min);
}


// --- 顯示卡片 END ---

// --- 讀取卡片的資訊 ---

function emphText(textToEmph,color) {
	if ( color == 'green' ) {
		// #137300: 墨綠色
		return '<b style="color: #137300;">' + textToEmph.toString() + '</b>';
	} 
	else if ( color == 'yellow' ) {
		return '<b style="color: orange;">'+ textToEmph.toString() +'</b>';
		// return '<b style="color: orange; font-size: 22px;">'+ textToEmph.toString() +'</b>';
	}
	else if ( color == 'red' ) {
		return '<b style="color: red;">'+ textToEmph.toString() +'</b>';
		// return '<b style="color: red; font-size: 28px;">'+ textToEmph.toString() +'</b>';
	}
	return textToEmph.toString();
}

function getDaysLeftHtml(response, issueIndex){

	// 計算出此議題所剩餘的時間
	// 所剩餘的時間 = 議題存活時間(duration?) - ( 現在時間 - 議題發起時間(launchDate) )
	// 格式: 年-月-日-時-分-秒， e.g. 2017-01-22T05:19:17.153Z
	// alert( response.issueList[issueIndex].launchDate );	// debug
	// 此regex可將數字從字串中取出，若有多個數字則會以array的方式回傳
	let tArr = response.issueList[issueIndex].launchDate.match( /\d+/g );	
	// Date() usage: var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	// 根據response的launchDate先計算出創立的date資訊
	let launchDate = new Date( tArr[0], tArr[1], tArr[2], tArr[3], tArr[4], tArr[5] );	
	let dueDate = new Date();
	// 再根據launchDate和duration計算出dueDate
	dueDate.setDate( launchDate.getDate() + response.issueList[issueIndex].duration );	
	let today = new Date();
	let timeDiff = ( dueDate.getTime() - today.getTime() ) / 1000;	// /1000: ms to sec
	let dayDiff = Math.floor(timeDiff / 86400);
	timeDiff %= 86400;
	let hourDiff = Math.floor(timeDiff / 3600);
	timeDiff %= 3600;
	let minuteDiff = Math.floor(timeDiff / 60);
	timeDiff %= 60;
	let secDiff = Math.floor(timeDiff);
	if( dayDiff >= 1 ) {
		if( dayDiff >= 10 ) return '還剩'+ emphText(dayDiff,'green') +'天';
		else if( dayDiff >= 4 ) return '還剩'+ emphText(dayDiff,'yellow') +'天';
		else return '還剩'+ emphText(dayDiff,'red') +'天';
	}
	else if ( hourDiff >= 1 ) {
		return '還剩'+ emphText(hourDiff,'red') +'小時' + emphText(minuteDiff,'red') + '分';
	} else if ( minuteDiff >= 1 ) {
		return '還剩'+ emphText(minuteDiff,'red') +'分';
	} else {
		return '還剩'+ emphText(secDiff,'red') +'秒';
	}

	// if( today.getFullYear() - timeArr[Time.year] ){
	// 	return '還剩'+ ( today.getFullYear()-timeArr[Time.year] ) +'天';
	// } else if ( today ) {

	// }
	// return '還剩'+ emphText(randomNum(1,30)) +'天';
}

function getCardsInfo(){
	// 讀入各個卡片的資訊
	$.ajax({
		url: 'https://stormy-fjord-31975.herokuapp.com/apis/issue',
		type: "GET",
		dataType: 'json',
		xhrFields: {
		  withCredentials: true
		},
		success: function(response){

			// debug
			console.log("%cSuccesfully get data from database!","font-weight: bold; color: blue");
			// alert("Succesfully get data from database! reponse issueList length: " + response.issueList.length );
			for(let i=0;i<response.issueList.length;i++){
				let card = "#card" + i;
				if( !$(card).length ) continue;	//如果卡片模板不存在就跳下一個iteration
				// 接著開始填卡片的各個資訊
				$(card).find(".title").text( response.issueList[i].title );		// title
				$(card).find(".card_content").text( response.issueList[i].introduce );	// introduction
				$(card).find(".days_left").html( getDaysLeftHtml(response, i) );	// 剩餘天數
				$(card).find(".fa.fa-comment").text(" " + response.issueList[i].comments + " ");	// 留言數
				$(card).find(".fa.fa-check-square-o").text(" " + response.issueList[i].votes + " ");	// 投票數
				
				// 顯示agreeRatioBar的動畫
				// Randomize days left, the amounts of the comments, vote ratio, and the amount of votes. 
				// let agreeRatio = 投票贊成數/反對數 * 100;
				let agreeRatio = randomNum(0,100);
				/* 防止一些顯示的bug QAQ (因為目前只要width>98%或<2%便會有顯示錯誤的問題，
				所以只好將width限制在2~98之間*/
				if(agreeRatio > 98) {
					agreeRatio = 98;
				} else if(agreeRatio < 2) {
					agreeRatio = 2;
				}
				$(card).find(".agreeBar").delay( delayInterval/2 + delayInterval * i ).animate({width: agreeRatio+"%"}, animationPeriod, "swing");
				
				$(card).find(".disagreeBar").delay( delayInterval + delayInterval * i ).animate({width: (100-agreeRatio)+"%"}, animationPeriod, "swing");

				// test
				// let str = "SUMMARY:Dad's birthday";
				// console.log( str.match(/^SUMMARY\:(.)*$/gm) );
			}
			
		},
		error:function(xhr, ajaxOptions, thrownError){ 
		    console.log("<id="+i+">" + "card status:" + ixhr.status); 
		    console.log("error:" + thrownError); 
		}
	});	

}

// --- 讀取卡片的資訊 END ---

// --- Main ---

$(document).ready(function(){

	generateCard(amountOfCard);
	getCardsInfo();

});