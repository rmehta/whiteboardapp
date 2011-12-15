// register plugins
app.views.whiteboard = {
	path:'views/page_layout.html'
}

$.index = 'whiteboard';
app.version = -1 // -1 = development mode / no files in localStorage

$(document).ready(function() {
	// home is whiteboard
	$('.brand').attr('href','#whiteboard');	

	app.pen_font = "delius"; // delius, pacifico, rock-salt
	app.pen_color = "green"; // black, blue, red, green

});

var WhiteboardApp = Class.extend({
	init: function() {
		$.require('views/whiteboardsidebar.js');
		$.require('views/whiteboardlist.js');
		$.require('views/whiteboard.js');

		app.sidebar = new WhiteboardSidebar();
		app.wb = new Whiteboard();			
	}
});
