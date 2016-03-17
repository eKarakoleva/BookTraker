$(document).ready(function() {
	"use strict";
	
	var USER_ENDPOINT = "http://localhost:3000/user";
	function userEndpoint(userId) {
		return USER_ENDPOINT + "/" + userId;
	}
	
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
	if(userId == null && readCookie('admin') == null){ 
		window.location.assign("http://localhost:8080/BookTraker/page/index.html");
	}
	
	function listUsers(){
		$.ajax(USER_ENDPOINT, {
			method: "GET",
			dataType: "json"
		}).then(function(response) { 
			_.forEach(response, function(user) {
				if(user.status == 1){
					var list = '<li id=\"'+user.id+'\" class="list-group-item">'+user.username+'<button type="button" class="btn btn-danger block_button">Block user</button></li>';
				    $('.user_list').append(list);
				}else{
					var list = '<li id=\"'+user.id+'\" class="list-group-item">'+user.username+'<button type="button" class="btn btn-success unblock_button">Unblock user</button></li>';
				    $('.user_list').append(list);
				}
			});
			
		});
	}
	
	function blockUser(){
		$(document).on('click', '.block_button',function(){
			var user_id = $(this).parent().attr('id');
			var button = $(this);
			$.ajax(userEndpoint(user_id), {
				method: "GET",
				dataType: "json",
			}).then(function(response) { 
			
				var user = {
					fname: response.fname,
					lname: response.lname,
					username: response.username,
					password: response.password,
					email: response.email,
					status: 2
				};
				$.ajax(userEndpoint(user_id), {
					method: "PUT",
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(user),
					dataType: "json"
				}).then(function(response) {
					
					var button_parent = button.parent();
					button.remove();
					button_parent.append('<button type="button" class="btn btn-success unblock_button">Unblock user</button>');
					
				});
			});
		});
	}	
	function unblockUser(){
		$(document).on('click', '.unblock_button',function(){
			var button = $(this);
			var user_id = $(this).parent().attr('id');
			$.ajax(userEndpoint(user_id), {
				method: "GET",
				dataType: "json",
			}).then(function(response) { 
			
				var user = {
					fname: response.fname,
					lname: response.lname,
					username: response.username,
					password: response.password,
					email: response.email,
					status: 1
				};
		
				$.ajax(userEndpoint(user_id), {
					method: "PUT",
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(user),
					dataType: "json"
				}).then(function(response) {
					var button_parent = button.parent();
					button.remove();
					button_parent.append('<button type="button" class="btn btn-danger block_button">Block user</button>');
				});
			});
		});
	}	
	
	
	
	listUsers();
	blockUser();
	unblockUser();
});