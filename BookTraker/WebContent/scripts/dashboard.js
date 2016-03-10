$(document).ready(function() {
	"use strict";
	
	var LIST_ENDPOINT = "http://localhost:3000/book_list";
	function bookEndpoint(bookId) {
		return LIST_ENDPOINT + "/" + bookId;
	}
	
	var userInfo = document.cookie.split('=');
	var userName = userInfo[1].split(';');
	$('#user.dropdown-toggle').text(userName[0]);
	$('#user.dropdown-toggle').append("<span class=\"caret\"></span>");
	console.log(document.cookie);
	$.ajax(LIST_ENDPOINT, {
		method: "GET",
		dataType: "json"
	}).then(function(response) {
		console.log(response);
	});
	
	
	$.ajax(LIST_ENDPOINT, {
		method: "GET",
		data: {
			user_id: userInfo[2]
		},
		dataType: "json"
	}).then(function(response) {
		 		
		_.forEach(response, function(book) {
			console.log(book);
			var a = '<div class="col-lg-4">\
		            <div class="form_hover" style=\'background-image: url('+book.picture_url+'); background-color: #428BCA; background-size: cover\'>\
		                <div class="header">\
		                    <div class="blur"></div>\
		                    <div class="header-text">\
		                        <div class="panel panel-success" style="height: 247px;">\
		                            <div class="panel-heading">\
		                                <h3 style="color: #428BCA;">'+book.name+'</h3>\
		                            </div>\
		                            <div class="panel-body">\
			                            <div class="form-group">\
	                                		Autor:<b>'+book.autor+'</b>\
	                                	</div>\
		                                <div class="form-group">\
		                                	Genre:<b>'+book.genre+'</b>\
		                                </div>\
		                                <div class="form-group">\
		                                    START BOOK:<b>'+book.start_book+'</b>\
		                                </div>\
		                                <div class="form-group">\
		                                    End reading time date:<b>'+book.finish_book+'</b>\
		                                </div>\
		                            </div>\
		                        </div>\
		                    </div>\
		                </div>\
		            </div>\
		        </div>';
			
			$(".row").append(a);
		});
	});

	 $( "#book_start_time" ).datepicker();
	 $( "#book_start_time" ).removeClass('form-control hasDatepicker');
	 $( "#book_start_time" ).addClass('form-control');
	 
	 $('#datetimepicker').data("DateTimePicker").FUNCTION();
});