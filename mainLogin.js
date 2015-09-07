require(['jquery', 'core', 'fe.placeholder',"fe.autocomplete", "fe.url"], function ($, Core, placeholder, autocomplete, URL) {
	Core.page.extend({
		cache:{},
		init: function(){
			this.initDom();
			this.pageStart();
			this.initPageUrl();
			this.initNameEvent();
			this.initPassEvent();
			this.initCkBox();
			this.initSubmit();	
		},
		initDom: function(){
			var ca = this.cache;
			ca.$wrap = $('#main'),
			ca.$username = $('.username', ca.$wrap),
			ca.$password = $('.password', ca.$wrap);
		},
		initNameEvent: function(){
			var $main = this.cache.$wrap
				$username = this.cache.$username;				
			$username.autoFill(Core.page.eSuffix, {
		        sameWidth: false,
		        pushValue: true
		    });
		    $main.delegate('.username', 'input propertychange', function(){
		    	var $nameDel = $('.name-del', $main);
		    	if($(this).val()){
				  	$nameDel.css('display','block');
				}else{
				 	$nameDel.css('display','none');
				}
		    }).delegate('.username', 'keyup focusin', function(event){
		    	var $autoFill = $('.autoFill');
		    	if(event.which==64 || $(this).val().indexOf('@')!=-1){
		    		console.log('显示');
					$autoFill.css('display','block');
				}else{
					$autoFill.css('display','none');
				}
		    }).delegate('.name-del', 'click', function(){
		    	$username.val('').trigger('focus');
				$(this).css('display','none');
		    });		    
			// $('#username').bind('input propertychange', function() {
			// 	if($('#username').val()){
			// 	  	$('#name-del').css('display','block');
			// 	}else{
			// 	 	$('#name-del').css('display','none');
			// 	}			
			// }).bind('keyup',function(event){
			// 	if(event.which==50 || $(this).val().indexOf('@')!=-1){
			// 		$('.autoFill').css('display','block');
			// 	}else{
			// 		$('.autoFill').css('display','none');
			// 	}
			// });
		},
		initPassEvent: function(){
			var $main = this.cache.$wrap,				
				$password = this.cache.$password,
				$usename = this.cache.$username;
			$main.delegate('.password', 'input propertychange', function(){
				var $passDel = $('.pass-del', $main);
				if($password.val()){
				  	$passDel.css('display','block');
				}else{
				  	$passDel.css('display','none');
				}
			}).delegate('.pass-del', 'click', function(){
				var username = $username.val();
				$('.reset', $main).trigger('click');			
				$username.val(username);
				$password.trigger('focus');
				$(this).css('display','none');
			});

			// $('#password').bind('input propertychange', function() {
			// 	if($('#password').val()){
			// 	  	$('#pass-del').css('display','block');
			// 	}else{
			// 	  	$('#pass-del').css('display','none');
			// 	}
			// })

			// $('#pass-del').click(function(){
			// 	var username = $('#username').val();
			// 	$('input[type="reset"]').trigger('click');			
			// 	$('#username').val(username);
			// 	$('#password').trigger('focus');
			// 	$(this).css('display','none');
			// })
		},
		initSubmit:function(){
			var $main = this.cache.$wrap
				$username = this.cache.$username,
				$password = this.cache.$password;
			$main.delegate('.form', 'submit',function(){
				var flag = true;
				if(!$username.val()){
					$('.nameErrInfo', $main).html('账号不能为空');
					flag = false;
				}
				if(!$password.val()){
					$('.passErrInfo', $main).html('密码不能为空');
					flag = false; 
				}
				return flag;
			})
			// $('form').submit(function(){
			// 	var flag = true;
			// 	if(!$('#username').val()){
			// 		$('#nameErrInfo').html('账号不能为空');
			// 		flag = false;
			// 	}
			// 	if(!$('#password').val()){
			// 		$('#passErrInfo').html('密码不能为空');
			// 		flag = false; 
			// 	}
			// 	return flag;
			// });
		},
		initCkBox:function(){
			var $main = this.cache.$wrap;
			$main.delegate('.ckBox', 'change' ,function(){
				var flag;
				if($(this).attr('checked')){
					$(this).removeAttr('checked');
					flag = 0;
				}else{
					$(this).attr('checked','checked');
					flag = 1;
				}
				$('input[name="savelogin"]', $main).val(flag);
			})
		},
		initPageUrl: function(){
			var $main = this.cache.$wrap,
				target = encodeURIComponent(URL.getPara('target')),
				loginUrl = window.location.href;				
			var url = 'http://global.163.com/urs/redirect.html?target=', 
				url2 = loginUrl.substr(0,loginUrl.indexOf('?'));
			if(target!=''){
				url += target;
				url2 += '?target='+target;
			}else{
				var indexURL = encodeURIComponent(loginUrl.substr(0, loginUrl.lastIndexOf('/')));
				url += indexURL;
				url2 += '?target='+indexURL; 
			}
			console.log('url:' + decodeURIComponent(url));
			console.log('url2:'+decodeURIComponent(url2));
			$('input[name="url"]', $main).val(url);
			$('input[name="url2"]', $main).val(url2);
		},
		pageStart: function(){
			var $main = this.cache.$wrap,
				$username = this.cache.$username,
				$password = this.cache.$password;
			var errorType = URL.getPara("errorType");
			var errorUsername = URL.getPara("errorUsername");
			if(errorType!=''){
				$username.val(errorUsername);
				$('.name-del',$main).css('display','block');
				$password.trigger('focus');
				switch(errorType){
					case "420":
						$('.nameErrInfo',$main).html('用户名不存在');
						break;
					case "460":
						$('.passErrInfo',$main).html('密码错误');
						break;
				}
			}else{
				$username.placeholder("网易邮箱/手机号").trigger('focus');
				$password.placeholder('密码');
			}
		},
		eSuffix:['@163.com', '@126.com', '@yeah.net', '@yeah.com', 
				'@vip.163.com', '@vip.126.com', '@188.com', '@vip.188.com', 
				'@qq.com', '@yahoo.com', '@sina.com', '@sohu.com']
	})
});
