let daysLeft = 7;
let amountOfCard = 6;
let delayInterval = 300;	// For the animation of the progress bars. In ms.

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
				</div>\
				<!-- Status -->\
				<div class="status_bar">\
					<p class="days_left">還剩Err天</p>\
					<p class="right_corner_text">\
						<i class="fa fa-check-square-o" aria-hidden="true">  Err  </i>\
						<i class="fa fa-comment" aria-hidden="true">  Err  </i> \
					</p>\
				</div>';

$(document).ready(function(){

	generateCard(amountOfCard);

});

function generateCard( amount_of_card ) {
	for(let i=0; i<amount_of_card; i++) {
		let card = document.createElement("div");
		// Set up the id and the class of the card
		$(card)
		.attr("id", "card"+i )
		.addClass("card transition")
		.html(cardHTML);

		// Randomize days left, the amounts of the comments, vote ratio, and the amount of votes. 
		let agreeRatio = randomNum(0,100);
		/* 防止一些顯示的bug QAQ (因為目前只要width>98%或<2%便會有顯示錯誤的問題，
		所以只好將width限制在2~98之間*/
		if(agreeRatio > 98) {
			agreeRatio = 98;
		} else if(agreeRatio < 2) {
			agreeRatio = 2;
		}
		$(card).find(".days_left").html('還剩'+ emphasizeDaysLeft(randomNum(1,30)) +'天');
		$(card).find(".fa.fa-comment").text(" " + randomNum(0,500) + " ");
		$(card).find(".agreeBar").delay( delayInterval/2 + delayInterval * i ).animate({width: agreeRatio+"%"}, 350, "swing");
		$(card).find(".disagreeBar").delay( delayInterval + delayInterval * i ).animate({width: (100-agreeRatio)+"%"}, 350, "swing");
		$(card).find(".fa.fa-check-square-o").text(" " + randomNum(0,2000) + " ");

		// append the card to the card container
		$(".card_container").append(card);
	}
}

function emphasizeDaysLeft(days_left) {
	if(days_left >= 10){
		return '<b>' + days_left.toString() + '</b>';
	} 
	else if(days_left >= 5) {
		return '<b style="color: orange; font-size: 22px;">'+ days_left.toString() +'</b>';
	}
	else {
		return '<b style="color: red; font-size: 28px;">'+ days_left.toString() +'</b>';
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
