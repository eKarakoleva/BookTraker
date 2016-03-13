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
	
	function stat(book_stat,selector){
		var books = [];
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(book) {
				var array_prop = ""
				if(book_stat == 'author'){
					array_prop = book.author;
				}else{
					if(book_stat == 'genre'){
						array_prop = book.genre;
					}else{
						array_prop = book.name;
					}
				}
				if(typeof books[array_prop]== 'undefined' && books[array_prop] == null){
					books[array_prop] = 0;
				}else{
					books[array_prop] = 0;
				}
		});	
			var list = '<li class="list-group-item">'+Object.keys(books).length+'</li>';
		    $(selector).append(list);
	
		});
	}
	
	function total(book_stat,selector){
		var books = [];
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			var total = 0;
			_.forEach(response, function(book) {
				if(book_stat == 'reading_days'){
					total += book.reading_days;
				}else{
					if(book_stat == 'total_pages'){
						total += book.total_pages;
					}
				}
			});	
			var list = '<li class="list-group-item">'+total+'</li>';
		    $(selector).append(list);
	
		});
	}


	stat('author','ul.total_author_list');
	stat('genre','ul.total_genres');
	stat('name','ul.total_books');
	
	total('total_pages','ul.total_pages');
	total('reading_days','ul.total_days');
	
});