/*
WhiteboardSidebar
-----------------
*/

WhiteboardSidebarView = Class.extend({
	init: function() {
		this.make();
		if($.session)
			this.reset();
		this.controller = new WhiteboardSidebarController(this);
	},
	make: function() {
		$('.span5').empty().html('<div class="sidebar">\
			<div class="sections">\
				<div class="sidebar_section round" id="wb_login" style="margin-top: 0px">\
				</div>\
				<div class="sidebar_section round" id="wb_list">\
					<button class="btn small" onclick="javascript:app.wb.new_whiteboard();">New</button>\
					<h5>My Whiteboards</h5>\
					<div class="items"></div>\
					<div class="no_items help-block">None saved yet</div>\
				</div>\
				<div class="sidebar_section round" id="pen_style">\
					<div>\
					<h5>Style</h5>\
					<table>\
						<tr>\
							<td style="width: 50%">\
								<div class="clearfix">\
									<ul class="inputs-list">\
										<li>\
											<label>\
												<input type="radio" name="penfont" value="delius" />\
												<span class="pen-font-delius">Font</span>\
											</label>\
										</li>\
										<li>\
											<label>\
												<input type="radio" name="penfont" value="pacifico" />\
												<span class="pen-font-pacifico">Font</span>\
											</label>\
										</li>\
										<li>\
											<label>\
												<input type="radio" name="penfont" value="rock-salt" />\
												<span class="pen-font-rock-salt">Font</span>\
											</label>\
										</li>\
									<ul>\
								</div>\
							</td>\
							<td style="width: 50%">\
								<div class="clearfix">\
									<ul class="inputs-list pen-color-list">\
										<li>\
											<label>\
												<input type="radio" name="pencolor" value="red" />\
												<span class="pen-color-red">Red</span>\
											</label>\
										</li>\
										<li>\
											<label>\
												<input type="radio" name="pencolor" value="black" />\
												<span class="pen-color-black">Black</span>\
											</label>\
										</li>\
										<li>\
											<label>\
												<input type="radio" name="pencolor" value="green" />\
												<span class="pen-color-green">Green</span>\
											</label>\
										</li>\
									<ul>\
								</div>\
							</td>\
						</tr>\
					</table>\
					</div>\
				</div>\
				<div class="sidebar_section round" id="wbuserlist">\
					<button class="btn small">Add</button>\
					<h5>Shared With</h5>\
					<div class="items"></div>\
					<div class="no_items help-block">Private</div>\
				</div>\
			</div>\
			<div id="message_area">\
		</div>');
		$('#wb_login').css('display', 'block');
		$('#pen_style').css('display', 'block');
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