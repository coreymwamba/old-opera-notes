/*Handle requests from background.html*/
function handleRequest(
	//The object data with the request params
	request, 
	//These last two ones isn't important for this example, if you want know more about it visit: http://code.google.com/chrome/extensions/messaging.html
	sender, sendResponse
	) {
	if (request.callFunction == "toggleSidebar")
		toggleSidebar();
}
chrome.extension.onRequest.addListener(handleRequest);

/*Small function which create a sidebar(just to illustrate my point)*/
var sidebarOpen = false;
function toggleSidebar() {
	if(sidebarOpen) {
		var el = document.getElementById('mySidebar');
		el.parentNode.removeChild(el);
		sidebarOpen = false;
	}
	else {
		var sidebar = document.createElement('iframe');
                var noteURL = chrome.extension.getURL("old-opera-notes.html");  
		sidebar.setAttribute("src",noteURL);
                sidebar.id = "mySidebar";
		sidebar.style.cssText = "position:fixed;top:0px;left:0px;width:400px;height:100%;background:white;border-right:2px solid grey;resize:horizontal;overflow-x:auto;z-index:999999;";
		document.body.appendChild(sidebar);
		sidebarOpen = true;
	}
}
