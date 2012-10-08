/*
*******************************************************************
Chameleon Namespace
*******************************************************************
*/

if(window.chameleon==null)window.chameleon=new Object();
window.chameleon.version_chameleon_js="1.0.1";




/*
*******************************************************************
WIDGET LIFE CYCLE
*******************************************************************	
*/

/*
	- Initializes HTML page as a Chameleon Widget.
	- Exposes callback methods for entire Chameleon lifecycle events.
		onLoad
		onCreate
		onResume
		onPause
		onLayout
		onScrollTop
		onScrollElsewhere
		onLayoutModeStart
		onLayoutModeComplete
		onConnectionAvailableChanged
		onConfigure
		onTitleBar
		onRefresh
		notChameleon
	- All callbacks are optional.



	
*/


window.chameleon.version=function(options)
{
	if(options==null){
		var versioninfo={};
		versioninfo.chameleon="1.0.0";
		try{if(window['Chameleon.Widget.Info']!=null)versioninfo.chameleon=window['Chameleon.Widget.Info'].version();}catch(e){}
		versioninfo.chameleon_js=window.chameleon.version_chameleon_js;
		versioninfo.chameleon_jquery_js=window.chameleon.version_chameleon_jquery_js;
		return versioninfo;
	
	}else if(options.compare!=null && options.compare.v1!=null && options.compare.v2!=null){
		var v1_split=options.compare.v1.split(".");
		var v2_split=options.compare.v2.split(".");
		
		var steps=Math.max(v1_split.length,v2_split.length);
		
		var r=0;
		
		for(var i=0;i<steps;i++){
			var v1_num=0;
			var v2_num=0;
			if(v1_split[i]!=null)v1_num=Number(v1_split[i]);
			if(v2_split[i]!=null)v2_num=Number(v2_split[i]);
			
			if(v1_num>v2_num){
				r=1;
				break;
			}else if(v1_num<v2_num){
				r=-1;
				break;
			}
		}
		
		return r;
		
	}else if(options.require!=null){
		var r=true;
		var v=window.chameleon.version();
		
		if(r && options.require.chameleon!=null){
			if(window.chameleon.version({compare:{v1:v.chameleon,v2:options.require.chameleon}})<0)r=false;
		}
		
		
		if(r && options.require.chameleon_js!=null){
			if(window.chameleon.version({compare:{v1:v.chameleon_js,v2:options.require.chameleon_js}})<0)r=false;
		}
		
		
		if(r && options.require.chameleon_jquery_js!=null){
			if(window.chameleon.version({compare:{v1:v.chameleon_jquery_js,v2:options.require.chameleon_jquery_js}})<0)r=false;
		}
		
		
		
		return r;
	}
	
	
}



window.chameleon.widget=function(settings)
{
	window.chameleon.settings=settings;
	if(!window.chameleon.exists() && settings.notChameleon!=null)settings.notChameleon();
	if(settings.onRefresh==null)settings.onRefresh=function(){
		window.chameleon.refresh({reload:true});
	}
	if(settings.onTitleBar==null)settings.onTitleBar=function(){
		window.chameleon.top();
	}	
	var manual_init = false;
	if(settings.manual_init!=null)manual_init=settings.manual_init;
	if(window['Chameleon.Widget.LifeCycle']!=null)window['Chameleon.Widget.LifeCycle'].widgetInit(manual_init);
}



window.chameleon.initialize=function()
{
	if(window.chameleon.hasinitialized!=true){
		window.chameleon.hasinitialized=true;
		if(window['Chameleon.Widget.LifeCycle']!=null)window['Chameleon.Widget.LifeCycle'].initialize();
		//alert("all is well");
	}
	
}


window.chameleon.log=function(message)
{
	if(window['Chameleon.Widget.Info']!=null)window['Chameleon.Widget.Info'].log(message);
}





/*
*******************************************************************
REFRESH
*******************************************************************	
*/

/*
	- Simulates the end user clicking the refresh icon in the widget title bar.
	- Options: 
		- reload(boolean):If true, the entire HTML page reloads.
*/
window.chameleon.refresh=function(options)
{
	var reload=false;
	if(options.reload!=null)reload=options.reload;
	if(window['Chameleon.Widget.LifeCycle']!=null)window['Chameleon.Widget.LifeCycle'].refresh(reload);
}

/*
*******************************************************************
NETWORK CONNECTIVITY
*******************************************************************	
*/

/*
	- Returns true if an internet connection is available.
*/
window.chameleon.connected=function()
{
	var r=true;
	if(window['Chameleon.Widget.LifeCycle']!=null)r=window['Chameleon.Widget.LifeCycle'].connectionIsAvailable();
	return r;
}


/*
*******************************************************************
WIDGET LAYOUT MODE
*******************************************************************	
*/

/*
	- Returns true if the widget's layout is being edited by the user.
*/
window.chameleon.isInLayoutMode=function()
{
	var r=false;
	if(window['Chameleon.Widget.LifeCycle']!=null)r=window['Chameleon.Widget.LifeCycle'].isInLayoutMode();
	return r;
}


/*
*******************************************************************
ANDROID INTENTS
*******************************************************************	
*/


/*
	- Launch an actual Android Intent
	- options:
		- action(String): The action to apply to the intent.
		- data(String): A URI to apply to the intent.
		- component(Object): Target an Android component with this intent.
			- name(String): The full class name of the component to target.
			- package(String): The package the activity resides in.
			- type(String):activity or service. Specify what type of component you are targetting.
		- extras(Array of extra objects): A list of extras to add to the intent.
			- extra
				- name(String): The name of the extra to add.
				- value(anything): The value of the extra to add.
		- type(String): The type to apply to the intent.
		- result(Function) Recieve an asynchronous response from the component.
			- Does not work with normal startActivityForResult calls at this time.
			- This only works when using the ChameleonIntent Java class.
*/
window.chameleon.intent=function(options)
{
	if(window['Chameleon.Widget.Intent']!=null && options!=null){
		
		if(options.intent!=null){
			var uri="";
			if(options.uri!=null)uri=options.uri;
			window['Chameleon.Widget.Intent'].launchIntent(options.intent,uri);
		}else if(options.app!=null){
			window['Chameleon.Widget.Intent'].launchApp(options.app);
		}else{
			if(window.chameleon.intent_requests==null)window.chameleon.intent_requests={};
			if(options.result!=null)options.expectingResult=true;
			var pending_response_id=window['Chameleon.Widget.Intent'].intent(window.chameleon.toJSON(options));
			window.chameleon.intent_requests[pending_response_id]=options;
		}
		
	}
}


//private to Chameleon internals
window.chameleon.handleIntentResponse=function(request_id)
{
	//alert("incoming response:"+json_str);
	var json_str=window['Chameleon.Widget.Intent'].collectJSONResponse(request_id);
	window.chameleon.intent_requests[request_id].result(window.chameleon.evalJSON(json_str));
	window.chameleon.intent_requests[request_id]=null;
}


/*
	- Returns true if the target component exists on this device.
	- options:
		- component(Object): Target an Android component with this intent.
			- name(String): The full class name of the component to target.
			- package(String): The package the activity resides in.
*/
window.chameleon.componentExists=function(component)
{
	var r=false;
	if(component.name!=null && component.package!=null){
		r=window['Chameleon.Widget.Intent'].componentExists(component.package,component.name);
	}
	
	return r;
}


window.chameleon.findComponents=function(options)
{
	var r=null;
	if(options.app!=null){
		window['Chameleon.Widget.Intent'].findComponents(options.app);
	}
	
	return r;
}





/*
*******************************************************************
CLOSING
*******************************************************************	
*/

/*
	- If called from a widget, then the widget is removed from the dashboard.
	- If it is called from an HTML overlay window (see promptHTML), then it closes the window.
	- Both arguments only apply to HTML overlay windows.
		- success(Boolean): Specify the circumstances in which this window was closed.
			- true: desired operation completed successfully.
			- false: desired operation failed.
		- data(Object): An object to pass back to the entity that launched this.
*/ 
window.chameleon.close=function(success, data)
{
	var type=window.chameleon.getType();
	if(type=="widget"){
		if(window['Chameleon.Widget.UI']!=null)window['Chameleon.Widget.UI'].removeWidget();
	}else if(type=="window"){
		var data_str="";
		if(data!=null)data_str=window.chameleon.toJSON(data);
		if(window['Chameleon.Window']!=null)window['Chameleon.Window'].closeWindow(success,data_str);
	}
	
	
}


/*
*******************************************************************
DEV MODE
*******************************************************************	
*/

/*
	- Returns true if the widget is loaded in the "Make A Widget" widget.
*/
window.chameleon.devMode=function()
{
	var r=false;
	if(window['Chameleon.Widget.Info']!=null)r=window['Chameleon.Widget.Info'].isInDevMode();
	return r;
}


window.chameleon.getChameleonPackageName=function()
{
	var r="";
	if(window['Chameleon.Widget.Info']!=null)r=window['Chameleon.Widget.Info'].getChameleonPackageName();
	return r;
}


/*
*******************************************************************
WIDGET TYPE
*******************************************************************	
*/

/*
	- Returns the type of view this is.
		- "widget"
		- "window"
*/
window.chameleon.getType=function()
{
	var r="unknown";
	if(window['Chameleon.Widget.Info']!=null)r=window['Chameleon.Widget.Info'].getType();
	return r;
}

/*
*******************************************************************
CHAMELEON RUNTIME EXISTENCE
*******************************************************************	
*/

/*
	- Returns true if this widget is running in Chameleon.
*/
window.chameleon.exists=function()
{
	var r=false;
	if(window['Chameleon.Widget.Info']!=null && window['Chameleon.Widget.Info'].ping())r=true;
	return r;
}



/*
*******************************************************************
ACTION BUTTON
*******************************************************************	
*/
window.chameleon.action=function(options)
{
	var icon="";
	if(options.icon!=null)icon=options.icon;
	var visible=true;
	if(options.visible!=null)visible=options.visible;
	if(window['Chameleon.Widget.UI']!=null)window['Chameleon.Widget.UI'].setActionButton(icon,visible);	
}


/*
*******************************************************************
NATIVE SELECT LIST
*******************************************************************	
*/
window.chameleon.selectlist=function(options)
{
	if(options.result!=null)window.chameleon.selectlist_pendingcallback=options.result;
	if(window['Chameleon.Widget.UI']!=null)window['Chameleon.Widget.UI'].selectlist(window.chameleon.toJSON(options));	
}

window.chameleon.selectlist_callback=function()
{
	if(window['Chameleon.Widget.UI']!=null){
		var data = window['Chameleon.Widget.UI'].getlastselectlistresult();
		if(window.chameleon.selectlist_pendingcallback!=null){
			window.chameleon.selectlist_pendingcallback(window.chameleon.evalJSON(data));
		}
	}
}


/*
*******************************************************************
SCROLLING
*******************************************************************	
*/

/*
	- Scrolls the widget to the top.
*/
window.chameleon.top=function(){
	if(window['Chameleon.Widget.UI']!=null){
		window['Chameleon.Widget.UI'].top();
	}
}

window.chameleon.scrollTo=function(x,y){
	if(window['Chameleon.Widget.UI']!=null){
		window['Chameleon.Widget.UI'].scrollTo(x,y);
	}
}


/*
*******************************************************************
LOADING ANIMATION
*******************************************************************	
*/

/*
	- Displays widget loading animation.
	- options:
		-showloader(Boolean): Shows or hides the default animation for a loading operation.
*/
window.chameleon.showLoading=function(options){
	if(options!=null && window['Chameleon.Widget.UI']!=null){
	
		var timeout=(1000)*20; //default twenty seconds
		//if(options.timeout!=null)timeout=options.timeout;
		//if(options.showloader!=null)window['Chameleon.Widget.UI'].showLoading(options.showloader,timeout);
		if(options.showloader!=null)window['Chameleon.Widget.UI'].showLoading(options.showloader);
	}
}

/*
*******************************************************************
TITLE
*******************************************************************	
*/

/*
	- Changes the title in the Widget title bar.
	- options
		- text(String): The text to apply to the title bar.
*/
window.chameleon.setTitle=function(options){
	if(options!=null && options.text!=null && window['Chameleon.Widget.UI']!=null)window['Chameleon.Widget.UI'].setTitle(options.text);
}


/*
*******************************************************************
PROMPT HTML WINDOWS
*******************************************************************	
*/


/*
	- Launches a URL in a window that overlays the dashboard.
	- Does not work in views of type "window".
	- options:
		url(String): The url to load in the window.
		width(Number): A desired width for the window. Not required.
		height(Number): A desired height for the window. Not required.
		result(Function): Called when the window is closed.
			- args:
				- success(Boolean): specifies whether the intended operation completed successfully
				- data(Object): Optional data sent back from the window.
*/
window.chameleon.promptHTML=function(options){

	if(window['Chameleon.Widget.UI']!=null){
		
		if(options.result!=null || options.callback!=null){
			window.chameleon.pending_window_callback=function(success,data_str){
				var data=null;
				if(data_str!=null && data_str!="")data=window.chameleon.evalJSON(data_str);
				if(options.result!=null){
					options.result(success,data);
				}
				
				if(options.callback!=null){
					options.callback(success,data);
				}
			};
		}else{
			window.chameleon.pending_window_callback=null;
		}
	
		if(options.url!=null && options.width!=null && options.height!=null){
			window['Chameleon.Widget.UI'].promptHTML(options.url,options.width,options.height);
		}else if(options.url!=null){
			window['Chameleon.Widget.UI'].promptHTML(options.url);
		}
	}
}


/*
*******************************************************************
PROMPT OAUTH
*******************************************************************	
*/



/*
	- Start an Oauth handshake with a remote service.
	- Launches authorize page in an external web browser.
	- Supports Oauth 1 and 2
	- options:
		- version(String): "1.0" or "2.0".
		- consumerKey(String): The consumer key or application id of your application, specified by the service provider.
				- For Oauth 1, this value must be Chameleon encrypted in advance.
		- consumerSecret(String): Used for Oauth 1.0 only.
				- Must be Chameleon encrypted.
		- authorize(Object): The oauth authorize url.
			- url(String): The url for the authorize step of the oauth process.
			- args(Object): Extra arguments to send on the query string of the authorize url.
		- request(Object): The url for the request token step of the oauth 1.0 process.
			- url(String): The url for the request token step of the oauth 1.0 process.
			- args(Object): Extra arguments to send on the query string of the request url.
		- access(Object): The url for the access token step of the oauth 1.0 process.
			- url(String): The url for the access token step of the oauth 1.0 process.
			- args(Object): Extra arguments to send on the query string of the access url.
		- access()
		- callbackURL(String): The url to callback to when the Oauth process is complete.
		- onResult(Function): Triggered when the Oauth process completes.
			- args:
				- success(Boolean): returns true if the process was successful.
				- data(Object): The oauth data sent on the URL to the callback URL.
		
*/
		

window.chameleon.promptOauth=function(options)
{
	window.chameleon.promptOauth_dev(options);
}

window.chameleon.promptOauth_dev=function(options)
{
	if(window['Chameleon.Widget.UI']!=null){
		
		//Hold onto callback
		if(options.onResult!=null)window.chameleon.pending_oauth_callback=options.onResult;
		var options_json=window.chameleon.toJSON(options);
		window['Chameleon.Widget.UI'].promptOauth(options_json);	
	}
}



//private to Chameleon internals
window.chameleon.handleOauthResult=function(success)
{
	if(window.chameleon.pending_oauth_callback!=null){
		var data=null;
		if(success)data=window.chameleon.evalJSON(window['Chameleon.Widget.UI'].getLastOauthResponseData());
		window.chameleon.pending_oauth_callback(success,data);
		window.chameleon.pending_oauth_callback=null;
	}
}






/*
*******************************************************************
WIDGET DATA
*******************************************************************	
*/


/*
	- Save and persist an object for use with this widget instance.
	- data(Object): The object to save.
	- Do not use this method to save large blocks of cached data, use it for saving account and preference type data.
		- For large data caches, use saveLocalData instead.
	
*/
window.chameleon.saveData=function(data)
{
	if(window['Chameleon.Widget.Data']!=null){
		var data_str=window.chameleon.toJSON(data);
		window['Chameleon.Widget.Data'].setInstanceData(data_str);
	}
}

/*
	- Returns the object saved for this widget instance.
	- If no data has ever been saved, an empty object will be returned.
*/
window.chameleon.getData=function()
{
	var r=null;
	if(window['Chameleon.Widget.Data']!=null){
		var d_str=window['Chameleon.Widget.Data'].getInstanceData();
		r = window.chameleon.evalJSON(d_str);
	}
	if(r==null)r={};
	return r;
}


/*
	- Save and persist large blocks of data.
	- id(String): an identifier for this data block.
	- data(Object): The object to save.
*/
window.chameleon.saveLocalData=function(id,data)
{
	if(window['Chameleon.Widget.Data']!=null){
		var data_str=window.chameleon.toJSON(data);
		window['Chameleon.Widget.Data'].setLocalData(id,data_str);
	}
}

/*
	- Retrieve an object saved previously by id.
	- id(String): The id of the data block that was previously saved.
*/
window.chameleon.getLocalData=function(id)
{
	if(window['Chameleon.Widget.Data']!=null){
		var d_str=window['Chameleon.Widget.Data'].getLocalData(id);
		var obj=window.chameleon.evalJSON(d_str);
		if(obj==null)obj={};
		return obj;
	}
}



/*
	- Save an persist an object that is shared amongst all instances of this widget.
	- data(Object): An object to sdave and share with all other instances of this widget.
*/
window.chameleon.saveSharedData=function(data)
{
	if(window['Chameleon.Widget.Data']!=null){
		var data_str=window.chameleon.toJSON(data);
		window['Chameleon.Widget.Data'].setSharedData(data_str);
	}
}


/*
	- Retrieve the data object that is shared amongst all instances of this widget.
*/
window.chameleon.getSharedData=function()
{
	var r=null;
	if(window['Chameleon.Widget.Data']!=null){
		var d_str=window['Chameleon.Widget.Data'].getSharedData();
		if(d_str==null || d_str==""){
			//
		}else{
			r = window.chameleon.evalJSON(d_str);
		}
	}
	if(r==null)r={};
	return r;
	
}




/*
*******************************************************************
WIDGET RENDERING
*******************************************************************	
*/


/*
	- Clear the web view the hosts this widget instance.
	- Used to combat the "Android transparent WebView double-draw" bug.
*/
window.chameleon.invalidate=function()
{
	if(window['Chameleon.Widget.Render']!=null)window['Chameleon.Widget.Render'].invalidate();
}

window.chameleon.invalidateTwo=function()
{
	if(window['Chameleon.Widget.Render']!=null)window['Chameleon.Widget.Render'].invalidateTwo();
}


/*
*******************************************************************
LINK HANDLING
*******************************************************************	
*/
window.chameleon.proxyLinkClickToBrowser=function(e){
	e.preventDefault();
	var url=e.currentTarget.toString();
	chameleon.intent({action:"android.intent.action.VIEW",data:url});
}


/*
*******************************************************************
ANDROID SYSTEM SHORTCUTS
*******************************************************************	
*/	
window.chameleon.launchWiFiSettings=function(e)
{
	if(e!=null)e.preventDefault();
	 window.chameleon.intent({action:"android.settings.WIFI_SETTINGS"});
}



/*
*******************************************************************
POLLING
*******************************************************************	
*/
window.chameleon.poll=function(options){
	if(options.id!=null){
		
		if(window.chameleon.polls==null)window.chameleon.polls=[];
		
		var poll_obj=null;
		for(var i=0;i<window.chameleon.polls.length;i++){
			if(options.id==window.chameleon.polls[i].id){
				poll_obj=window.chameleon.polls[i];
				break;
			}
		}
		
		if(options.action=="start"){
			
			if(poll_obj==null){
				poll_obj={};
				poll_obj.id=options.id;
				poll_obj.interval=options.interval;
				poll_obj.callback=options.callback;
				poll_obj.running=false;
				window.chameleon.polls.push(poll_obj);
			}
			
			if(poll_obj!=null && poll_obj.running!=true){
				poll_obj.running=true;
				poll_obj.intervalid = setInterval(poll_obj.callback, poll_obj.interval);
			}
			
		}else if(options.action=="stop"){
			
			if(poll_obj!=null){
				if(poll_obj!=null && poll_obj.running==true){
					poll_obj.running=false;
					clearInterval(poll_obj.intervalid);
				}
			}
		}
		
	}
}



window.chameleon.withintimespan=function(options){

	var r=false;

	if(options.id!=null){
		
		if(window.chameleon.timespans==null)window.chameleon.timespans=[];
		
		var now=(new Date()).valueOf();
		
		var poll_obj=null;
		for(var i=0;i<window.chameleon.timespans.length;i++){
			if(options.id==window.chameleon.timespans[i].id){
				poll_obj=window.chameleon.timespans[i];
				break;
			}
		}
		
		
		if(options.action=="mark" || options.action==null){
			
			
			if(poll_obj==null){
				poll_obj={};
				poll_obj.id=options.id;
				window.chameleon.timespans.push(poll_obj);
			}
			
			if(poll_obj!=null ){
				if(options.duration!=null)poll_obj.duration=options.duration;
				poll_obj.last=now;
				r=true;
			}
			
			
		}else if(options.action=="test"){
			if(poll_obj!=null && poll_obj.last!=null && poll_obj.duration!=null){
				r=now<(poll_obj.last+poll_obj.duration);
			}
		}
		
	}
	
	
	return r;
	
}


/*
*******************************************************************
LOCATION
*******************************************************************	
*/

window.chameleon.getLocation=function()
{
	if(window['Chameleon.Widget.Location']!=null){
		var d_str=window['Chameleon.Widget.Location'].getLocation();
		var obj=window.chameleon.evalJSON(d_str);
		if(obj==null)obj={};
		return obj;
	}
}



/*
*******************************************************************
TIMESINCE
*******************************************************************	
*/
window.chameleon.timesince=function (time_str,type) {

	// Convert date into time since string
	
	
	function getTimeDifference(before, after) {
	
		// The difference
		var nTotalDiff = Math.abs(before.getTime() - after.getTime());
		// Object to contain the values
	    var oDiff = new Object();
	 	// Days
	    oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
	 	// Hours
	    oDiff.hours = Math.max(1, Math.floor(nTotalDiff/1000/60/60));
	 	// Minutes
	    oDiff.minutes = Math.max(1, Math.floor(nTotalDiff/1000/60));
	 	// Seconds
	    oDiff.seconds = Math.floor(nTotalDiff/1000);
	 	// Done 
	    return oDiff;
	    
	}

	
	// Now and then
	var now = new Date();
	var created =null;
	if(type=="int"){
		created = new Date(parseInt(time_str)*1000);
	}else{
		created = new Date(Date.parse(time_str));
	}
	
	
	var time_since = getTimeDifference(created, now);
	var timeSinceString = "";
	if (time_since.minutes < 60) {
		timeSinceString = time_since.minutes + " min" + (time_since.minutes > 1 ? "s" : "") + " ago";
	} else if (time_since.hours < 24) {
		timeSinceString = parseInt(time_since.hours) + " hour" + (time_since.hours > 1 ? "s" : "") + " ago";		    		
	} else {
		timeSinceString = parseInt(time_since.days) + " day" + (time_since.days > 1 ? "s" : "") + " ago";
	}
	return timeSinceString;
	
}








/*
*******************************************************************
JSON PARSING
*******************************************************************	
*/

///////////////////////////////////////////////////////////////////
/**
 * jQuery JSON Plugin
 * version: 2.3 (2011-09-17)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */



	var	escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};

	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON respresentation.
	 *
	 * @param o {Mixed} The json-serializble *thing* to be converted
	 *
	 * If an object has a toJSON prototype, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	window.chameleon.toJSON = typeof JSON === 'object' && JSON.stringify
		? JSON.stringify
		: function( o ) {

		if ( o === null ) {
			return 'null';
		}

		var type = typeof o;

		if ( type === 'undefined' ) {
			return undefined;
		}
		if ( type === 'number' || type === 'boolean' ) {
			return '' + o;
		}
		if ( type === 'string') {
			return window.chameleon.quoteString( o );
		}
		if ( type === 'object' ) {
			if ( typeof o.toJSON === 'function' ) {
				return window.chameleon.toJSON( o.toJSON() );
			}
			if ( o.constructor === Date ) {
				var	month = o.getUTCMonth() + 1,
					day = o.getUTCDate(),
					year = o.getUTCFullYear(),
					hours = o.getUTCHours(),
					minutes = o.getUTCMinutes(),
					seconds = o.getUTCSeconds(),
					milli = o.getUTCMilliseconds();

				if ( month < 10 ) {
					month = '0' + month;
				}
				if ( day < 10 ) {
					day = '0' + day;
				}
				if ( hours < 10 ) {
					hours = '0' + hours;
				}
				if ( minutes < 10 ) {
					minutes = '0' + minutes;
				}
				if ( seconds < 10 ) {
					seconds = '0' + seconds;
				}
				if ( milli < 100 ) {
					milli = '0' + milli;
				}
				if ( milli < 10 ) {
					milli = '0' + milli;
				}
				return '"' + year + '-' + month + '-' + day + 'T' +
					hours + ':' + minutes + ':' + seconds +
					'.' + milli + 'Z"';
			}
			if ( o.constructor === Array ) {
				var ret = [];
				for ( var i = 0; i < o.length; i++ ) {
					ret.push( window.chameleon.toJSON( o[i] ) || 'null' );
				}
				return '[' + ret.join(',') + ']';
			}
			var	name,
				val,
				pairs = [];
			for ( var k in o ) {
				type = typeof k;
				if ( type === 'number' ) {
					name = '"' + k + '"';
				} else if (type === 'string') {
					name = window.chameleon.quoteString(k);
				} else {
					// Keys must be numerical or string. Skip others
					continue;
				}
				type = typeof o[k];

				if ( type === 'function' || type === 'undefined' ) {
					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					continue;
				}
				val = window.chameleon.toJSON( o[k] );
				pairs.push( name + ':' + val );
			}
			return '{' + pairs.join( ',' ) + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given piece of json source.
	 *
	 * @param src {String}
	 */
	window.chameleon.evalJSON = typeof JSON === 'object' && JSON.parse
		? JSON.parse
		: function( src ) {
		return eval('(' + src + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param src {String}
	 */
	window.chameleon.secureEvalJSON = typeof JSON === 'object' && JSON.parse
		? JSON.parse
		: function( src ) {

		var filtered = 
			src
			.replace( /\\["\\\/bfnrtu]/g, '@' )
			.replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace( /(?:^|:|,)(?:\s*\[)+/g, '');

		if ( /^[\],:{}\s]*$/.test( filtered ) ) {
			return eval( '(' + src + ')' );
		} else {
			throw new SyntaxError( 'Error parsing JSON, source is not valid.' );
		}
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	window.chameleon.quoteString = function( string ) {
		if ( string.match( escapeable ) ) {
			return '"' + string.replace( escapeable, function( a ) {
				var c = meta[a];
				if ( typeof c === 'string' ) {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};







