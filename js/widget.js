(function(){
	chameleon.widget({
		onLoad: function(){
			console.log("Loaded");
		},
		onConfigure: function(){
			chameleon.promptHTML({url:"settings.html"});
		}
	});
	
})()