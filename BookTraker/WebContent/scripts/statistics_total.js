$(document).ready(function() {
	"use strict";
	
	var LIST_ENDPOINT = "http://localhost:3000/book_list";
	
	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}
	var userId = readCookie('userId');
	$('#user.dropdown-toggle').text(readCookie('username'));
	$('#user.dropdown-toggle').append("<span class=\"caret\"></span>");	
	
	if(userId == null){ 
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
			  var array_prop = "";
			_.forEach(response, function(book) {
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