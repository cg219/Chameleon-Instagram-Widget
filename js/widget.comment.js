(function(){
	var template = $.trim( $("#commentTemplate").html() );
	var userData = chameleon.getSharedData().defaults;
	var instagram = new Instagram("", "", "php/instalib.php", userData.user.value);
	var mediaID = chameleon.getData().currentMediaID;
	var commentsRaw = "";
		
	instagram.getComments(function(response){
		
		var data = response.data.length > 20 ? response.data.slice(response.data.length - 20) : response.data;
		$.each(data, function(index, object){
			if( index > 20 ){
				return false;
			}
			commentsRaw += template.replace(/{{comment}}/ig, object.text)
				.replace(/{{userImage}}/ig, object.from.profile_picture)
				.replace(/{{userID}}/ig, object.from.id)
				.replace(/{{username}}/ig, object.from.username)
				.replace(/{{id}}/ig, object.id);
		});
		
		chameleon.invalidate();
		//$(".console").append("Comments \n<pre>" + commentsRaw + "</pre>\n").chameleonInvalidate();
		
		$("#comments ul").append(commentsRaw).chameleonInvalidate();
		
		/*var dataString = "\n<pre>"
		$.each(response.data[0], function(key, ele){
			if( key > 10 ){
				return false;
			}
			dataString += ( key + ": " + ele + "\n" );
		});
		
		dataString += "</pre>\n"
		chameleon.invalidate();
		$(".console").append(dataString).chameleonInvalidate();*/
		
		
	}, mediaID);
	
	$("#comment-form #send").on("click", function(event){
		event.preventDefault();
		
		instagram.setComment(function(response){
			chameleon.close(true);
		}, mediaID, $("#comment-form #comment-input").val());
	});
	
	$("#comment-form #cancel").on("click", function(event){
		event.preventDefault();
		chameleon.close(true);
	});
})()