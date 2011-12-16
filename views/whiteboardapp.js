// register plugins
app.views.whiteboard = {
	path:'views/page_layout.html'
}

$.index = 'whiteboard';
app.version = 2 // -1 = development mode / no files in localStorage

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

		app.sidebar = new WhiteboardSidebarView();
		app.wb = new WhiteboardView();
		app.wb.controller.set_autosave();			
	}
});
