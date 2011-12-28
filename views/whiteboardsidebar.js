/*
WhiteboardSidebar
-----------------
*/

WhiteboardSidebarView = Class.extend({
	init: function() {
		var me = this;
		$('#wb_login').css('display', 'block');
		$('#pen_style').css('display', 'block');			

		if($.session)
			me.reset();
		me.controller = new WhiteboardSidebarController(me);
	},
	show_wb_list: function(display) {
		$('#wb_list').css('display', display ? 'block' : 'none');
		$('#wbuserlist').css('display', display ? 'block' : 'none');		
	},
	set_message: function(msg, type) {
		$('#message_area').html('<div class="alert-message block-message round '
			+(type || '')+'">'+msg+'</div>')
			.find(".alert-message")
			.delay(type=='error' ? 7000 : 3000)
			.fadeOut();
	},	
	reset: function() {
		if(!$.session.user || $.session.user=='guest') {
			// guest must either login or register
			this.show_wb_list(false);
			$('#wb_login').html('<a href="javascript:app.login()">Login</a> or \
				<a href="javascript:app.register()">Register</a> to save this whiteboard');
		} else {
			// save
			this.show_wb_list(true);
			$('#wb_login').html('<a href="javascript:app.wb.controller.save(true)" \
				id="save_whiteboard">Save</a> this whiteboard');
			this.wblist = new WhiteboardListView(this);
		}
	}
})


var WhiteboardSidebarController = Class.extend({
	init: function(view) {
		this.view = view;
		var me = this;
		$(document).bind('login', function() {
			me.view.reset();
		});
		$(document).bind('logout', function() {
			me.view.reset();
		});
		this.style_change();
	},
	style_change: function() {	
		$('.color-selector').click(function() {
			$('.color-selector.selected').removeClass('selected');
			$(this).addClass('selected');

			var new_color = $(this).attr('data-color');
			if(app.pen_color==new_color) return;
			app.pen_color = new_color;

			$.call({
				method:'whiteboardapp.controllers.helpers.style_change',
				type: 'POST',
				data: {pen_color:app.pen_color}
			});
			
		})
		
		// set
		$('.color-selector[data-color="'+app.pen_color+'"]').click();
	}
	
});