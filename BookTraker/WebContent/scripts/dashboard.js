$(document).ready(function() {
	"use strict";
	
	var LIST_ENDPOINT = "http://localhost:3000/book_list";
	var GENRES_ENDPOINT = "http://localhost:3000/genres";
	function bookEndpoint(bookId) {
		return LIST_ENDPOINT + "/" + bookId;
	}
	
	var userInfo = document.cookie.split(',');
	var userName = userInfo[0].split('=');
	var userName = userName[1];
	var userId = userInfo[1].split("=");
	var userId = userId[1];
	$('#user.dropdown-toggle').text(userName);
	$('#user.dropdown-toggle').append("<span class=\"caret\"></span>");	
	
	function listBooks(){
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(book) {
				bookElement(book.id,book.picture_url,book.name,book.autor,book.genre,book.start_book,book.finish_book);
			});
			$('button.edit_book').mouseover(function() {
				$(this).parent().children('div').prop('display','none');
				var header = $(this).parent().children('div');
				header.removeClass('header');
			});
			$('button.edit_book').on("mouseleave", function() {
				var header = $(this).parent().children('div');
				header.addClass('header');
			 });
		});
	}
	
	function bookElement(id,picture_url,name,autor,genre,start_book,finish_book){
			var a = '<div class="col-lg-4">\
		            <div class="form_hover" style=\'background-image: url('+picture_url+'); background-color: #428BCA; background-size: cover\'>\
		            <button type="button" id='+id+' class="btn btn-success edit_book">Edit</button>\
		            <div id="book_header_id" class="header">\
		                    <div class="blur"></div>\
		                    <div class="header-text">\
		                        <div class="panel panel-success" style="height: 247px;">\
		                            <div class="panel-heading">\
		                                <h3 style="color: #428BCA;">'+name+'</h3>\
		                            </div>\
		                            <div class="panel-body">\
			                            <div class="form-group">\
	                                		Autor:<b>'+autor+'</b>\
	                                	</div>\
		                                <div class="form-group">\
		                                	Genre:<b>'+genre+'</b>\
		                                </div>\
		                                <div class="form-group">\
		                                    START BOOK:<b>'+start_book+'</b>\
		                                </div>\
		                                <div class="form-group">\
		                                    End reading time date:<b>'+finish_book+'</b>\
		                                </div>\
		                            </div>\
		                        </div>\
		                    </div>\
		                </div>\
		            </div>\
		        </div>';
			
			$(".row").append(a);
	}
	
	function appendGenresToSelectMenu(){
		$.ajax(GENRES_ENDPOINT, {
			method: "GET",
			dataType: "json"
		}).then(function(response) {
			_.forEach(response, function(genre) {
				
				var option =$("<option />");
				option.text(genre.genre);
				option.attr('value',genre.genre);
				$('#book_genre').append(option);
				$('#edit_book_genre').append(option);
				
				
			});
		}); 
	}
	
	function checkForEmptyFields(){
		if($('#book_title').val() != "" && $('#book_autor').val() != "" && $('#book_pages').val() != "" && $('#url_cover').val() != ""){
			return true;	
		}
		return false;
	}
	
	
	function getLastBookId(){
		var promise = $.ajax(LIST_ENDPOINT, {
			method: "GET",
			dataType: "json"
		}).then(function(response) {
			var lastBookId = 0;
				_.forEach(response, function(book) {
					lastBookId = book.id;
			});			
		});
		
		promise.then(function(response) {
			return lastBookId;
		});	
	}
	
	function imageExists(url, callback) {
		  var img = new Image();
		  img.onload = function() { callback(true); };
		  img.onerror = function() { callback(false); };
		  img.src = url;
	}
	
	function addBook(){
		$(document).on('click', '#add_book', function(e){

				if(checkForEmptyFields()){
					var start_reading_date = $('#start_reading_date').val();
					var end_reading_date = $('#end_reading_date').val();
					var url_cover = $('#url_cover').val();
					var d1 = new Date(start_reading_date);
					var d2 = new Date(end_reading_date);
					if(d1.getTime() <= d2.getTime()){
						imageExists(url_cover, function(exists) {
							 if(exists == true){
								var promise = $.ajax(LIST_ENDPOINT, {
									method: "GET",
									dataType: "json"
								}).then(function(response) {
									var lastBookId = 0;
										_.forEach(response, function(book) {
											lastBookId = book.id;
									});	
										return lastBookId;
								});
								
								promise.then(function(response) {
									var book = {
											id: response+1,
											user_id: userId,
											name: $('#book_title').val(),
											autor: $('#book_autor').val(),
											genre: $('#book_gener').val(),
											total_pages: $('#book_pages').val(),
											start_book: start_reading_date,
											finish_book: end_reading_date,
											picture_url: url_cover
											
										};
										$.ajax(LIST_ENDPOINT, {
											method: "POST",
											contentType: "application/json; charset=utf-8",
											data: JSON.stringify(book),
											dataType: "json"
										}).done(function(response) {
											
											bookElement(response.id,response.picture_url,response.name,response.autor,response.genre,response.start_book,response.finish_book);
											$('#add_book_modal').find('input').val("");
											$('button.edit_book').mouseover(function() {
												$(this).parent().children('div').prop('display','none');
												var header = $(this).parent().children('div');
												header.removeClass('header');
											});
											$('button.edit_book').on("mouseleave", function() {
												var header = $(this).parent().children('div');
												header.addClass('header');
											 });
										});
								});	
							 }else{alert('url');}
						});
					}else{
						alert("dates");
					}
				}else{
					alert("empty fields");
				}
		});	
	}
	
	$(document).on('click','.edit_book',function(e){
		e.preventDefault();
		var book_id = $(this).attr('id');
		
		var promiseEdit = $.ajax(bookEndpoint(book_id), {
			method: "GET",
			dataType: "json"
		}).then(function(response) {
			return response;
		});
		
		promiseEdit.then(function(response) {
			
			$('#edit_book_title').val(response.name);
			$('#edit_book_autor').val(response.autor);
			$('#edit_book_genre').find('option[value=\"'+response.genre+'\"]').attr("selected", true); 
			$('#edit_book_pages').val(response.total_pages);
			$('#edit_start_reading_date').val(response.start_book);
			$('#edit_end_reading_date').val(response.finish_book);
			$('#edit_url_cover').val(response.picture_url);
		});
		$("#editBookModal").modal();
		
	});
	

	
	listBooks();
	appendGenresToSelectMenu();
	addBook();
});