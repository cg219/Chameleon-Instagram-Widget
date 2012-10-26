(function(){
	var instagram;
	
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
					.replace( /{{image}}/ig, object.images.thumbnail.url )
					.replace( /{{imgalt}}/ig, object.filter)
					.replace( /{{id}}/ig, object.id)
					.replace( /{{userID}}/ig, object.user.id)
					.replace( /{{userImage}}/ig, object.user.profile_picture)
					.replace( /{{like}}/ig, liked.button )
					.replace( /{{border}}/ig, liked.border )
					.replace( /{{userLiked}}/ig, object.user_has_liked );
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
				.replace( /{{imgsrc}}/ig, data.images.thumbnail.url)
				.replace( /{{imgalt}}/ig, data.filter)
				.replace( /{{id}}/ig, data.id)
				.replace( /{{userID}}/ig, data.user.id)
				.replace( /{{userImage}}/ig, data.user.profile_picture)
				.replace( /{{like}}/ig, liked,button )
				.replace( /{{border}}/ig, liked.border )
				.replace( /{{userLiked}}/ig, data.user_has_liked );
		}
		
		return list;
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
	
	$(".feed ul").on("mousedown", "img.image", function(event){
		event.preventDefault();
		event.stopPropagation();
		var likeButton = $(this).siblings(".like");
		var tap = (new Date()).valueOf();
		var delta = (tap - lastTap);
		
		lastTap = tap;
		
		if( delta < 800 ){
			chameleon.invalidate();
			$(".console").append("DoubleTap\n").chameleonInvalidate();
			likePhoto(likeButton.data("liked"), likeButton.data("id"), likeButton);
		}
	});
	
})()