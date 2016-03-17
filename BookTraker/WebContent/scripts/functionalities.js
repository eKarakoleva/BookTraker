$(document).ready(function() {
	"use strict";
	
	
	var USER_ENDPOINT = "http://localhost:3000/user";
	var ADMIN_ENDPOINT = "http://localhost:3000/administrator";
	
	function createCookie(name,value,days) {
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime()+(days*24*60*60*1000));
	        var expires = "; expires="+date.toGMTString();
	    }
	    else var expires = "";
	    document.cookie = name+"="+value+expires+"; path=/";
	}
	
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
						var user = {
							fname: fname,
							lname: lname,
							username: username,
							password: pass,
							email: mail,
							status: 1,
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
	
	function userRights(userInfo){
		if(userInfo.status == 1){
		    return 1;
		}
		
		if(userInfo.status == 2){
			return 2;
		}
		
		if(userInfo.status == 3){
			return 3;
		}
		
		return false;
	}
	
	function loginCheck(obj,username,password){
		var user_obj = {};
		var pass = 0;
		_.forEach(obj, function(user) {
			if(user.username == username && user.password == password){
				pass = 1;
				user_obj = user;
			}
		});	
		 
		if(pass = 1){
			return user_obj;
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
				var user = loginCheck(response,username,password);
				 if(user !== false){
					 
					 $('input#signin_password').val("");
					 $('input#login_username').val("");
					 $('.login-modal').hide();
					 $('.modal-backdrop').hide();

					 if(user.status == 1){
						 createCookie('username',username,7);
						 createCookie('userId',user.id,7);
						 window.location.assign("http://localhost:8080/BookTraker/page/dashboard.html");
					 }else{
						 if(user.status == 3){
							 createCookie('username',username,7);
							 createCookie('userId',user.id,7);
							 createCookie('admin','true',7);
							 window.location.assign("http://localhost:8080/BookTraker/page/admin_page.html");
						 }else{
							if(user.status == 2){
								alert('sorry, you are blocked')
							}
						 }
					 }
				 }else{
					alert('wrong username or password');
				 }
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
