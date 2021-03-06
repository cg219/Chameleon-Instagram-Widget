(function(){
	var instagram;
	var instagramApp = {
		package: "com.instagram.android",
		name: "com.instagram.android.activity.MainTabActivity"
	}
	
	chameleon.widget({
		onCreate: function(){
			refreshView("New");
		},
		onLoad: function(){
			refreshView("Loaded");
		},
		onConfigure: function(){
			chameleon.promptHTML({
				url:"settings.html",
				result: function(success, data){
					chameleon.invalidate();
					if(success){
						refreshView();
					}
					else{
						$("p").append("Nah Son").chameleonInvalidate();
					}
				}
			});
		},
		onRefresh: function(){
			refreshView("Refreshed");
		},
		onResume: function(){
			refreshView("Resumed");
		},
	});
	
	function refreshView(cycle){
		var userToken = chameleon.getSharedData().defaults.user.value;
			
		if( userToken ){
			if( !instagram ){
				instagram = new Instagram("", "", "php/instalib.php", userToken);
			}
			
			instagram.getUserFeed(function(response){
				var dataString = "\n" + cycle + "<pre>"
				$.each(response.data[0], function(key, ele){
					dataString += ( key + ": " + ele + "\n" );
				});
				
				dataString += "</pre>\n"
				//chameleon.invalidate();
				//$(".console").empty().append(dataString).chameleonInvalidate();
				
				chameleon.invalidate();
				$("ul").empty().append( populateFeed(response.data) ).chameleonInvalidate();
			}, 20);
		}
		else{
			chameleon.invalidate();
			$("p").append("\nNah Son").chameleonInvalidate();
		}
	}
	
	function populateFeed(data){
		var template = $.trim( $("#feedTemplate").html() );
		var list ="";
		var liked = {};
		var now = new Date().getTime();
		
		if( data.length )
		{
			$.each( data, function( i, object ){
				if( object.user_has_liked === true ){
					liked.button = " liked";
					liked.border = " likeBorder";
				}
				else{
					liked.button = "";
					liked.border = "";
				}
				
				
				
				list += template.replace( /{{username}}/ig, object.user.username || "No User" )
					.replace( /{{image}}/ig, object.images.standard_resolution.url )
					.replace( /{{imgalt}}/ig, object.filter)
					.replace( /{{id}}/ig, object.id)
					.replace( /{{userID}}/ig, object.user.id)
					.replace( /{{userImage}}/ig, object.user.profile_picture)
					.replace( /{{like}}/ig, liked.button )
					.replace( /{{border}}/ig, liked.border )
					.replace( /{{userLiked}}/ig, object.user_has_liked )
					.replace( /{{time}}/ig, getTime(now, object.created_time) );
			});
		}
		else{
			if( data.user_has_liked === true ){
				liked.button = " liked";
				liked.border = " likeBorder";
			}
			else{
				liked.button = "";
				liked.border = "";
			}
			
			list += template.replace( /{{username}}/ig, data.user.username || "No User" )
				.replace( /{{imgsrc}}/ig, data.images.standard_resolution.url)
				.replace( /{{imgalt}}/ig, data.filter)
				.replace( /{{id}}/ig, data.id)
				.replace( /{{userID}}/ig, data.user.id)
				.replace( /{{userImage}}/ig, data.user.profile_picture)
				.replace( /{{like}}/ig, liked,button )
				.replace( /{{border}}/ig, liked.border )
				.replace( /{{userLiked}}/ig, data.user_has_liked )
				.replace( /{{time}}/ig, getTime(now, data.created_time) );
		}
		
		return list;
	}
	
	function getTime( now, time ){
		var label;
		
		time = ((now * .001) - time);
				
		if( time < 60 ){
			label = " seconds ago";
		}
		else if( time >= 60 && time < 3600 ){
			time = Math.floor(time / 60);
			label = time > 1 ? " minutes ago" : " minute ago";
		}
		else if( time >= 3600 ){
			time = Math.floor( time / 3600 );
			label = time > 1 ? " hours ago" : " hour ago";
		}
		
		label = time.toString() + label;
		return label;
	}
	
	function likePhoto( isLiked, id, element){
		if( isLiked === true ){
			instagram.deleteLike(function(response){
				element.removeClass("liked");
				element.siblings(".image").removeClass("likeBorder");
				element.data("liked", false);
			}, id);
		}
		else{
			instagram.setLike(function(response){
				element.addClass("liked");
				element.siblings(".image").addClass("likeBorder");
				element.data("liked", true);
			}, id);
		}
	}
	
	$(".feed ul").on("click", "span.like", function(event){
		event.preventDefault();
		event.stopPropagation();
		var $this = $(this);
		
		likePhoto($this.data("liked"), $this.data("id"), $this);
	});
	
	$(".feed ul").on("click", "span.comment", function(event){
		event.preventDefault();
		event.stopPropagation();
		
		var localData = chameleon.getData();
		
		localData.currentMediaID = $(this).data("id");
		chameleon.saveData(localData);
		
		chameleon.promptHTML({
			url: "comment.html"
		});
	});
	
	var lastTap = 0;
	
	/*$(".feed ul").on("mousedown", "img.image", function(event){
		var likeButton = $(this).siblings(".like");
		var tap = (new Date()).valueOf();
		var delta = (tap - lastTap);
		
		lastTap = tap;
		
		if( delta < 800 ){
			likePhoto(likeButton.data("liked"), likeButton.data("id"), likeButton);
		}
	});*/
	
	$(".feed ul").on("click", "img.image", function(event){
		if(chameleon.componentExists(instagramApp)){
			chameleon.intent({
				component: instagramApp,
				action: "a n d r o i d . i n t e n t . a c t i o n . SEND"
			});
		}
		else{
			chameleon.invalidate();
			$(".console").append("Click\n").chameleonInvalidate();
		}
	});
	
})()