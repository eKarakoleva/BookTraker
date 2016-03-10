$(document).ready(function() {
	"use strict";
	
	
	var USER_ENDPOINT = "http://localhost:3000/user";
	function userEndpoint(userId) {
		return USER_ENDPOINT + "/" + userId;
	}
	
	
	function loginModal(){
		$(document).on('click','.signup-tab',function(e){
			e.preventDefault();
		    $('#signup-taba').tab('show');
		});	
		
		$(document).on('click','.signin-tab',function(e){
		   	e.preventDefault();
		    $('#signin-taba').tab('show');
		});
		    	
		$(document).on('click','.forgetpass-tab',function(e){
		 	e.preventDefault();
		   	$('#forgetpass-taba').tab('show');
		});
		
		$(document).on('click','.btn-launch',function(e){
		 	e.preventDefault();
		 	$('.login-modal').show();
		 	$('.modal-backdrop').hide();
		});
		
	}
	
	function registration(){
		$(document).on('click', 'button#register_btn', function(){
			var fname = $('input#fname').val();
			var lname = $('input#lname').val();
			var mail = $('input#remail').val();
			var pass = $('input#signup_password').val();
			var username = $('input#username').val();
			
			var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
			if(testEmail.test(mail) && fname.length != 0 && lname.length != 0 && pass.length != 0 && username.length != 0){
				var user_id = 0;
				var promise = $.ajax(USER_ENDPOINT, {
					method: "GET",
					dataType: "json"
				}).then(function(response) {
					return response;	
				});
				
				
				promise.then(function(response) {
					if(checkIfUserDataExist(username,mail,response)){
						user_id = response.length + 1;
						var user = {
							id: user_id,
							fname: fname,
							lname: lname,
							username: username,
							password: pass,
							email: mail
						};
						$.ajax(USER_ENDPOINT, {
							method: "POST",
							contentType: "application/json; charset=utf-8",
							data: JSON.stringify(user),
							dataType: "json"
						}).done(function(response) {
							$('.login-modal').hide("");
							$('input#fname').val("");
							$('input#lname').val("");
							$('input#remail').val("");
							$('input#signup_password').val("");
							$('input#username').val("");
							alert("success");
						});
					}
				});
			}
		});
	}
	
	function loginCheck(arr,username,password){
		var name = 0;
		var pass = 0;
		var id = 0;
		var found = arr.some(function (el) {
			if(el.username == username && el.password == password){
				id = el.id;
				if(el.username == username){
					name = 1;
				}
				if(el.password == password){
					pass = 1;
				}
			}
		});	
		
		if(pass == 1 && name == 1){
			return id;
		}else{
			return false;
		}
	}
	
	function login(){
		$(document).on('click', 'button#login_btn', function(){
			var password = $('input#signin_password').val();
			var username = $('input#login_username').val();
			
			$.ajax(USER_ENDPOINT, {
				method: "GET",
				dataType: "json"
			}).then(function(response) {
				
				var userId = loginCheck(response,username,password);
				 if(userId !== false){
					 alert('login');
					 $('input#signin_password').val("");
					 $('input#login_username').val("");
					 $('.login-modal').hide();
					 $('.modal-backdrop').hide();
					 document.cookie="userId="+userId+"; username="+username+";";
				 }else{
					 alert("Wrong username or password");
				 }
				console.log(document.cookie);
			});
		});
	}
	

	
	function checkIfUserDataExist(username,email,arr) {
			var exist = 0;
			var found = arr.some(function (el) {
				if(el.username == username || el.email == email){
				    if(el.username == username){
				    	exist = 1;
				    }
				    if(el.email == email){
				    	exist = 2;
				    } 
				}
			});
	
			if(exist == 1){
	    		alert('Username already exist'); 
	    		return false;
	    	}
			if(exist == 2){
	    		alert('Email already exist');
	    		return false;
	    	}
	    	return true; 
	}
	
	loginModal();
	registration();
	login();
});	
