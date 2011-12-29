// register plugins
app.views.whiteboard = {
	path:'whiteboardapp/views/page_layout.html'
}

$.index = 'whiteboard';
app.version = -1 // -1 = development mode / no files in localStorage
app.brand = 'Whiteboard App';

$(document).ready(function() {
	// home is whiteboard
	$('.brand').attr('href','#whiteboard');	

	app.pen_font = "delius"; // delius, pacifico, rock-salt
	app.pen_color = "green"; // black, blue, red, green

});

var WhiteboardApp = Class.extend({
	init: function() {
		$.require('whiteboardapp/views/whiteboardsidebar.js');
		$.require('whiteboardapp/views/whiteboardlist.js');
		$.require('whiteboardapp/views/whiteboard.js');

		app.sidebar = new WhiteboardSidebarView();
		app.wb = new WhiteboardView();
		app.wb.controller.set_autosave();			
	}
});
