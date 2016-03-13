$(document).ready(function() {
	"use strict";
	
	var LIST_ENDPOINT = "http://localhost:3000/book_list";
	
	var userInfo = document.cookie.split(',');
	var userName = userInfo[0].split('=');
	var userName = userName[1];
	var userId = userInfo[1].split("=");
	var userId = userId[1];
	$('#user.dropdown-toggle').text(userName);
	$('#user.dropdown-toggle').append("<span class=\"caret\"></span>");	
	
	if(document.cookie == ""){ 
		window.location.assign("http://localhost:8080/BookTraker/page/index.html");
	}
	
	function totalAuthors(){
		var books = {};
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(book) {
				if(typeof books[book.author]== 'undefined' && books[book.author] == null){
					books[book.author] = 0;
				}else{
					books[book.author] = 0;
				}
		});	

			    var list = '<li class="list-group-item">'+Object.keys(books).length+'</li>';
			    $('ul.total_author_list').append(list);
			
		});
	}
	
	totalAuthors();
	
});