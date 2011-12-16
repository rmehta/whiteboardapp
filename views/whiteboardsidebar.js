/*
WhiteboardSidebar
-----------------
*/

WhiteboardSidebarView = Class.extend({
	init: function() {
		this.make();
	},
	make: function() {
		var me = this;
		$('.span5').empty().load('views/sidebar.html', function() {
			$('#wb_login').css('display', 'block');
			$('#pen_style').css('display', 'block');			

			if($.session)
				me.reset();
			me.controller = new WhiteboardSidebarController(me);
		});
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
		// bind (update user)
		$('input[name="pencolor"]').change(function() {
			var val = $('input[name="pencolor"]:checked').val();
			if(app.pen_color == val) return;
			app.pen_color = val;
			$.call({
				method:'controllers.helpers.style_change',
				type: 'POST',
				data: {pen_color:app.pen_color}
			});
		});

		$('input[name="penfont"]').change(function() {
			var val = $('input[name="penfont"]:checked').val();
			
			// set font in color
			$('#pen_style .pen-color-list span')
				.removeClass('pen-font-delius')
				.removeClass('pen-font-rock-salt')
				.removeClass('pen-font-pacifico')

			$('#pen_style .pen-color-list span').addClass('pen-font-' + val)

			if(app.pen_font == val) return;
			app.pen_font = val;
			$.call({
				method:'controllers.helpers.style_change',
				type: 'POST',
				data: {pen_font:app.pen_font}
			});
		});

		// set
		$('input[name="pencolor"][value="'+app.pen_color+'"]').click();
		$('input[name="penfont"][value="'+app.pen_font+'"]').click();
	}
	
});