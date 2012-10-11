(function(){
	$("#add-account").on("click", function(event){
		event.preventDefault();
		chameleon.promptOauth({
			version: "2.0",
			authorize: {
				url: "https://api.instagram.com/oauth/authorize/",
				args: {
					response_type: "token",
					scope: "likes+comments+relationships"
				}
			},
			callbackURL: "http://chameleonlauncher.com/widgets/common/oauth/callback/",
			consumerKey: "65e43cf848b1469bbf0efca8521650bf",
			onResult: function(success, data){
				if(success){
					//alert("Data", data.toSource());
					chameleon.invalidate();
					var dataString = "\n<pre>"
					$.each(data, function(key, ele){
						dataString += ( key + ": " + ele + "\n" );
					});
					
					dataString += "</pre>\n"
					$(".console").append(dataString).chameleonInvalidate();
					
					storeToken(data.access_token);
				}
				else{
					//alert("ERRRRRRRRRR");
					chameleon.invalidate();
					$(".console").empty().append("ERRR").chameleonInvalidate();
				}
			}
		});
	});
	
	
	$("#close-button").on("click", function(event){
		event.preventDefault();
		chameleon.close(true);
	});
	

	function storeToken(token){
		var sharedData = chameleon.getSharedData();
		var instagram = new Instagram("", "", "php/instalib.php", token);
		
		instagram.getUser( function(response){
			chameleon.invalidate();
			
			if( sharedData.accounts ){
				sharedData.accounts = [];
			}
			
			sharedData.accounts.push({
				user : response.data.username.toUpperCase(),
				userID : response.data.id,
				token : token
			});
			
			chameleon.saveSharedData(sharedData);
			createAccountsList( getAccounts() );
		}, "self");
		
	}
	
	
	function getAccounts(){
		return chameleon.getSharedData().accounts;
	}
	
	
	function createAccountsList( accounts ){
		if( accounts ){
			var accountsList = [];
			
			$.each(accounts, function(key, obj){
				accountsList.push({
					name: obj.user.toUpperCase(),
					value: obj.token
				});
				
			});
			
			$("#accounts").chameleonSelectList({
				title: "Choose Instagram Account",
				list: accountsList,
				selectedValue: accountsList[0].name.toUpperCase()
			});
		}
		
	}
	
	function createFeeds(){
		$("#feeds").chameleonSelectList({
				title: "Choose Instagram Feed",
				list: [
					{
						name: "User Feed", value:"userfeed"
					},
					{
						name: "Popular Feed", value:"popular"
					}
				],
				selectedValue: "userfeed".toUpperCase()
			});
	}
	
	createAccountsList( getAccounts() );
	createFeeds();
	
})()