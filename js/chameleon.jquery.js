if(window.chameleon==null)window.chameleon=new Object();
window.chameleon.version_chameleon_jquery_js="1.0.1";



$(document).ready(function(){
	
	
	if(window.chameleon!=null){
		
		window.chameleon.proxyLinkClick=function(e){
			e.preventDefault();
			var url=e.currentTarget.toString();
			chameleon.intent({action:"android.intent.action.VIEW",data:url});
		}
		
		
		window.chameleon.proxyAllLinks=function(options)
		{
			var handler=window.chameleon.proxyLinkClick;
			if(options!=null && options.callback!=null)handler=options.callback;
			$("a").die("click",handler).live("click",handler);
			
		}
		
		
		
	
		window.chameleon.proxyAllLinks=function(options)
		{
			var handler=window.chameleon.proxyLinkClick;
			if(options!=null && options.callback!=null)handler=options.callback;
			$("a").die("click",handler).live("click",handler);
			
		}
		
	
		
		
		
	}
	


});


(function($) {


	var CHAMELEON_COMMON_FOLDER="http://chameleonlauncher.com/widgets/common/";

	
	$.fn.exists = function()
	{
		return this.length>0;
	}

	
	/*
		- Forces element to redraw.
		- Use to overcome Android transparent WebView double-draw bug.
	*/
	$.fn.chameleonInvalidate=function(options)
	{
		
		if(window.chameleon.exists()){
			var self = this;
			var time=100;
			
			if(options!=null && options.time!=null)time=options.time
			var callback=null;
			if(options!=null)callback=options.callback;
			self.hide().fadeIn(500,callback);
			return self;
		}
		
		
	}
	
	
	///////////////////////////////////////////////////////////////////
	// DEFAULT MESSAGES CONTENT
	
	
	function getDefaultMessageTemplateInstance(options)
	{
		var html="";
		
		html+="<div class='chameleon-widget-message "+options.linkclass+"'>";
		if(options.icon!=null)html+=	"<img src='"+options.icon+"' class='chameleon-widget-message-img' />";
		html+=	"<div class='chameleon-widget-message-text'>";
		html+=		"<p class='chameleon-widget-message-main'>"+options.title+"</p><p class='chameleon-widget-caption'>"+options.caption+"</p>";
		html+=	"</div>";
		html+="</div>";
		
		return html;
	}
	
	
	/*
		- Display a Chameleon styled alert message to the end user.
		- args:
			- onClick
			- icon
			- title
			- caption
			
	*/
	$.fn.chameleonWidgetMessageHTML=function (options) {	
		if(options!=null){
			if(options.linkclass==null)options.linkclass="default-message-link";
			var html=getDefaultMessageTemplateInstance(options);
			this.html(html);
			if(options!=null && options.onClick!=null)$("."+options.linkclass).die("click",options.onClick).live("click",options.onClick);
		}
		return this;
	}
		
		
	$.fn.chameleonWidgetErrorHTML=function (options) {	
		var icon=CHAMELEON_COMMON_FOLDER+"images/chameleon_config_widget_message_icon.png";
		var linkclass="launch-error";
		var title="An Error Occured";
		var caption="";
		
		if(options!=null){
			if(options.icon!=null)icon=options.icon;
			if(option.noicon==true)icon=null;
			if(options.linkclass!=null)linkclass=options.linkclass;
			if(options.title!=null)title=options.title;
			if(options.caption!=null)caption=options.caption;
		}
		
		var html=getDefaultMessageTemplateInstance({
														icon:icon,
														linkclass:linkclass,
														title:title,
														caption:caption
													});
	
		this.html(html);
		if(options!=null && options.onClick!=null)$("."+linkclass).die("click",options.onClick).live("click",options.onClick);
		return this;
	}	
	
		
	$.fn.chameleonWidgetConfigureHTML=function (options) {	
		
		
		var icon=CHAMELEON_COMMON_FOLDER+"images/chameleon_config_widget_message_icon.png";
		var linkclass="launch-configure";
		var title="Configure This Widget";
		var caption="Click the gear to customize this widget.";
		
		if(options!=null){
			if(options.icon!=null)icon=options.icon;
			if(options.noicon==true)icon=null;
			if(options.linkclass!=null)linkclass=options.linkclass;
			if(options.title!=null)title=options.title;
			if(options.caption!=null)caption=options.caption;
		}
		
		var html=getDefaultMessageTemplateInstance({
														icon:icon,
														linkclass:linkclass,
														title:title,
														caption:caption
													});
	
		this.html(html);
		if(options!=null && options.onConfigure!=null)$("."+linkclass).die("click",options.onConfigure).live("click",options.onConfigure);
		return this;
	}
	
	
	
	$.fn.chameleonWidgetNeedWiFiHTML=function (options) 
	{	
		var icon=CHAMELEON_COMMON_FOLDER+"images/chameleon_connecterror_widget_message_icon.png";
		var linkclass="launch-wifi";
		var title="I Need Internet!";
		var caption="Click here to change your network settings.";
		
		
		if(options!=null){
			if(options.icon!=null)icon=options.icon;
			if(option.noicon==true)icon=null;
			if(options.linkclass!=null)linkclass=options.linkclass;
			if(options.title!=null)title=options.title;
			if(options.caption!=null)caption=options.caption;
		}
		
		var html=getDefaultMessageTemplateInstance({
														icon:icon,
														linkclass:linkclass,
														title:title,
														caption:caption
													});
		
		this.html(html);
		$("."+linkclass).die("click", window.chameleon.launchWiFiSettings).live("click", window.chameleon.launchWiFiSettings);
		return this;
	}
		
		

		


	/*
		- Forces all links to be proxied to an external browser rather than loading in the widget.
			
	*/		
	$.fn.chameleonProxyAllLinks=function(options)
	{
		var handler=window.chameleon.proxyLinkClickToBrowser;
		if(options!=null && options.callback!=null)handler=options.callback;
		this.find("a").die("click",handler).live("click",handler);
		return this;
		
	}
	
	
	
	
	$.fn.chameleonSelectList=function(options)
	{
		var prev_data=this.data("selectlist");
		
		if(options.list!=null){
			if(prev_data==null || prev_data.list==null){
			
				if(options.selectedIndex==null)options.selectedIndex=0;
				if(options.selectedValue!=null){
					for(var i=0;i<options.list.length;i++){
						if(options.list[i].value==options.selectedValue){
							options.selectedIndex=i;
						}
					}
				}else{
					options.selectedValue=options.list[options.selectedIndex];
				}
				this.data("selectlist",options);
				this.html(options.list[options.selectedIndex].name);
			
				this.click(function(e){
					e.preventDefault();
					var this_ref=$(this);
					var listdata=this_ref.data("selectlist");
					chameleon.selectlist(
										{
											title:listdata.title,
											list:listdata.list,
											result:function(result_data){
													listdata.selectedIndex=result_data.selectedIndex;
													listdata.selectedValue=result_data.selectedValue;
													this_ref.html(listdata.list[result_data.selectedIndex].name);
													this.data("selectlist",listdata);
											}
										}
										);	
				});
			}else{
				prev_data.list=options.list;
				this.data("selectlist",prev_data);
				this.html(prev_data.list[prev_data.selectedIndex].name);
			}
			
		}
		
		if(options.selectedValue!=null && prev_data!=null){
			for(var i=0;i<prev_data.list.length;i++){
				if(prev_data.list[i].value==options.selectedValue){
					prev_data.selectedIndex=[i];
					prev_data.selectedValue=options.selectedValue;
					this.data("selectlist",prev_data);
					this.html(prev_data.list[prev_data.selectedIndex].name);
				}
			}
			
		}
		
		
		if(options.selectedIndex!=null && prev_data!=null){
			prev_data.selectedIndex=options.selectedIndex;
			this.data("selectlist",prev_data);
			this.html(prev_data.list[prev_data.selectedIndex].name);
		}
		
		if(options.getSelectedItem==true){
			if(prev_data!=null && prev_data.list!=null){
				var index=0;
				if(prev_data.selectedIndex!=null)index=prev_data.selectedIndex;
				var item=prev_data.list[prev_data.selectedIndex];
				if(item==null)item={name:null,value:null};
				return item;
			}else{
				return {name:null,value:null};
			}
			
		}
			
		return this;
		
				
		
	}



	
		
		
		
	

	
}(jQuery));