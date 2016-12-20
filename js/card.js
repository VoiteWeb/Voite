let daysLeft = 7;
let amountOfCard = 12;

let cardHTML = '<!-- Card Picture -->\
				<div class="card_picture transition"></div>\
				<!-- Title -->\
				<h2 class="title transition">您覺得車管會收300元合理嗎?</h2>\
				<!-- Description -->\
				<p class="transition card_content">車證工本費僅50元，但車管會一學期車證費卻收到300元... ~"~</p>\
				<!-- Progress bar -->\
				<div class="progress">\
			  	<div class="progress-bar progress-bar-success" role="progressbar" style="width:40%">\
					Free Space\
				</div>\
				<div class="progress-bar progress-bar-warning" role="progressbar" style="width:10%">\
					Warning\
				</div>\
				<div class="progress-bar progress-bar-danger" role="progressbar" style="width:20%">\
					Danger\
				</div>\
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
		// Randomize the amounts of the comments, days left, and the votes. 
		$(card).find(".days_left").html('還剩'+ emphasizeDaysLeft(randomNum(1,30)) +'天');
		$(card).find(".fa.fa-comment").text(" " + randomNum(0,200) + " ");
		$(card).find(".fa.fa-check-square-o").text(" " + randomNum(0,300) + " ");

		// append the card to the card container
		$(".card_container").append(card);
	}
}

function emphasizeDaysLeft(days_left) {
	if(days_left >= 10){
		return days_left.toString();
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
