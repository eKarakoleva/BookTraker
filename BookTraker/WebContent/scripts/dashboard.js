$(document).ready(function() {
	"use strict";
	
	if(document.cookie == ""){ 
		window.location.assign("http://localhost:8080/BookTraker/page/index.html");
	}
	
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
	
	function disableHover(selector){
		$(selector).mouseover(function() {
			$(this).parent().children('div').prop('display','none');
			var header = $(this).parent().children('div');
			header.removeClass('header');
		});
		$(selector).on("mouseleave", function() {
			var header = $(this).parent().children('div');
			header.addClass('header');
		 });
	}
	
	function listBooks(){
		$.ajax(LIST_ENDPOINT, {
			method: "GET",
			data: {
				user_id: userId
			},
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(book) {
				bookElement(book.id,book.picture_url,book.name,book.author,book.genre,book.start_book,book.finish_book);
			});
			disableHover('button.edit_book');
			disableHover('button.delete_book');
			
		});
	}
	
	function bookElement(id,picture_url,name,author,genre,start_book,finish_book){
			var a = '<div class="col-lg-4">\
		            <div class="form_hover" style=\'background-image: url('+picture_url+'); background-color: #428BCA; background-size: cover\'>\
		            <button type="button" id='+id+' class="btn btn-success edit_book">Edit</button>\
		            <button type="button"id='+id+' class="btn btn-danger delete_book">Delete</button>\
		            <div id="book_header_id" class="header">\
		                    <div class="blur"></div>\
		                    <div class="header-text">\
		                        <div class="panel panel-success" style="height: 247px;">\
		                            <div class="panel-heading">\
		                                <h3 style="color: #428BCA;">'+name+'</h3>\
		                            </div>\
		                            <div class="panel-body">\
			                            <div class="form-group">\
	                                		author:<b>'+author+'</b>\
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
			});
			_.forEach(response, function(genre) {
				var option =$("<option />");
				option.text(genre.genre);
				option.attr('value',genre.genre);
				$('#edit_book_genre').append(option);	
			});
		}); 
	}
	
	function checkForEmptyFields(){
		if($('#book_title').val() != "" && $('#book_author').val() != "" && $('#book_pages').val() != "" && $('#url_cover').val() != ""){
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
	
	function parseDate(str) {
	    var mdy = str.split('/')
	    return new Date(mdy[2], mdy[0]-1, mdy[1]);
	}

	function daydiff(first, second) {
	    return Math.round((second-first)/(1000*60*60*24));
	}


	
	function addBook(){
		$(document).on('click', '#add_book', function(e){

				if(checkForEmptyFields()){
					if($.isNumeric($('#book_pages').val())){
						var start_reading_date = $('#start_reading_date').val();
						var end_reading_date = $('#end_reading_date').val();
						var url_cover = $('#url_cover').val();
						var d1 = new Date(start_reading_date);
						var d2 = new Date(end_reading_date);
						
						alert(daydiff(d1, d2));
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
												author: $('#book_author').val(),
												genre: $('#book_genre').val(),
												total_pages: $('#book_pages').val(),
												start_book: start_reading_date,
												finish_book: end_reading_date,
												reading_days: daydiff(d1, d2),
												picture_url: url_cover
												
											};
											$.ajax(LIST_ENDPOINT, {
												method: "POST",
												contentType: "application/json; charset=utf-8",
												data: JSON.stringify(book),
												dataType: "json"
											}).done(function(response) {
												
												bookElement(response.id,response.picture_url,response.name,response.author,response.genre,response.start_book,response.finish_book);
												$('#add_book_modal').find('input').val("");
												disableHover('button.edit_book');
												disableHover('button.delete_book');
											});
									});	
								 }else{alert('url');}
							});
						}else{
							alert("dates");
						}
					}else{alert("pages");}
				}else{
					alert("empty fields");
				}
		});	
	}
	
	function controlEditModal(){
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
				$('#edit_book_author').val(response.author);
				$('#edit_book_genre').find('option[value=\"'+response.genre+'\"]').attr("selected", true); 
				$('#edit_book_pages').val(response.total_pages);
				$('#edit_start_reading_date').val(response.start_book);
				$('#edit_end_reading_date').val(response.finish_book);
				$('#edit_url_cover').val(response.picture_url);
			});
			$("#editBookModal").attr('data-id',book_id);
			$("#editBookModal").modal();
		});
	}
	
	function updateBookInfo(){
		$(document).on('click','#edit_book_button', function(){
			var book_id = $("#editBookModal").attr('data-id');
	 		if($('#edit_book_title').val() != "" && $('#edit_book_author').val() != "" && $('#edit_book_pages').val() != "" && $('#edit_url_cover').val() != ""){
	 			if($.isNumeric($('#edit_book_pages').val())){
					var start_reading_date = $('#edit_start_reading_date').val();
					var end_reading_date = $('#edit_end_reading_date').val();
					var url_cover = $('#edit_url_cover').val();
					var d1 = new Date(start_reading_date);
					var d2 = new Date(end_reading_date);
					if(d1.getTime() <= d2.getTime()){
						imageExists(url_cover, function(exists) {
							 if(exists == true){
								var book = {
										user_id: userId,
										name: $('#edit_book_title').val(),
										author: $('#edit_book_author').val(),
										genre: $('#edit_book_genre').val(),
										total_pages: $('#edit_book_pages').val(),
										start_book: start_reading_date,
										finish_book: end_reading_date,
										reading_days: daydiff(d1, d2),
										picture_url: url_cover
										
									};
								$.ajax(bookEndpoint(book_id), {
									method: "PUT",
									contentType: "application/json; charset=utf-8",
									data: JSON.stringify(book),
									dataType: "json"
								}).then(function(response) {
									console.log(response);
									$('.container').children('.row').children().remove()
									listBooks();
								});
							 }else{alert('url');} 
						});
					}else{alert('date');}
	 			}else{alert("pages");}
			}else{alert('empty');}
		});
	}
	
	 function ConfirmAlert() {
		 var r = confirm("Are you sure?");
		 	if (r == true) {
	            return true;
	        } else {
	            return false;
	        }
	 }
	 
	function deleteBook(){
		$(document).on('click','.delete_book',function(){
			var book_id = $(this).attr('id');
			var this_button = $(this);
			if(ConfirmAlert()){
				$.ajax(bookEndpoint(book_id), {
					method: "DELETE"
				}).then(function(response) {
					console.log($(this));
					this_button.parent().parent().remove();
				});
			}
		});
	}
	
	$(document).on('click','a#logout', function(e){
		e.preventDefault();
		document.cookie = 'username='+userName+'; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		 window.location.assign("http://localhost:8080/BookTraker/page/index.html");
	});

	listBooks();
	appendGenresToSelectMenu();
	addBook();
	controlEditModal();
	updateBookInfo();
	deleteBook()
});