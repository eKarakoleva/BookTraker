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
	
	function sortByAuthorsDesc(){
		var books = [];
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
					books[book.author] = books[book.author]+1;
				}else{
					books[book.author] = books[book.author]+1;
				}
			});	
			var temp = [];
			
			for (var key in books) temp.push([key, books[key]]);
			temp.sort(function(a, b) {
			    a = a[1];
			    b = b[1];
	
			    return a > b ? -1 : (a < b ? 1 : 0);
			});
			
			var authors = [];
			if(temp.length < 3){var len = temp.length;}else{var len = 3;};
			for (var i = 0; i < len; i++) {
			    var key = temp[i][0];
			    var value = temp[i][1];
			    authors[key] = value;		   
			}
			
			for (var key in authors) {
			    var list = '<li class="list-group-item">'+key+' | books:'+authors[key]+'</li>';
			    $('ul.author_list').append(list);
			}
		});
	}
	
	
	function sortByGenresDesc(){
		var books = [];
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(book) {
				
				if(typeof books[book.genre]== 'undefined' && books[book.genre] == null){
					books[book.genre] = 0;
					books[book.genre] = books[book.genre]+1;
				}else{
					books[book.genre] = books[book.genre]+1;
				}
		});	
			var temp = [];
			for (var key in books) temp.push([key, books[key]]);
			temp.sort(function(a, b) {
			    a = a[1];
			    b = b[1];
	
			    return a > b ? -1 : (a < b ? 1 : 0);
			});
			
			var book = [];
			if(temp.length < 3){var len = temp.length;}else{var len = 3;};
			for (var i = 0; i < len; i++) {
			    var key = temp[i][0];
			    var value = temp[i][1];
			    book[key] = value;
			    var list = '<li class="list-group-item">'+key+' | books:'+book[key]+'</li>';
			    $('ul.genres').append(list);
			   
			}
		});
	}
	
	function sortByPagesDesc(){
		var books = {};
			$.ajax(LIST_ENDPOINT, {
				method: "GET",
				data: {
					user_id: userId
				},
				dataType: "json"
			}).then(function(response) { 
				response.sort(function(a, b){
					 return b.total_pages-a.total_pages
				});
				var j = 0;
				_.forEach(response, function(book) {
					var list = '<li class="list-group-item">'+book.name+' | pages:'+book.total_pages+'</li>';
				    $('ul.pages').append(list);
				    j++;
				    if(j == 3){return false};
				});	
			});
	}
	
	function sortByReadingDaysDesc(){
		var books = {};
			$.ajax(LIST_ENDPOINT, {
				method: "GET",
				data: {
					user_id: userId
				},
				dataType: "json"
			}).then(function(response) { 
				response.sort(function(a, b){
					 return b.reading_days-a.reading_days
				});
				var j = 0;
				_.forEach(response, function(book) {
					var list = '<li class="list-group-item">'+book.name+' | reading days:'+book.reading_days+'</li>';
				    $('ul.days').append(list);
				    j++;
				    if(j == 3){return false};
				});	
			});
	}
	
	sortByAuthorsDesc();
	sortByReadingDaysDesc();
	sortByPagesDesc();
	sortByGenresDesc();
	
});