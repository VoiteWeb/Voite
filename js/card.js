let daysLeft = 3;

$(document).ready(function(){
	$(".days_left").html('還剩'+ emphasizeDaysLeft(daysLeft) +'天');
	$(".fa.fa-comment").html(" 87 ");
	$(".fa.fa-check-square-o").text(" 168 ");
});

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

