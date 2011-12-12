/*

WhiteboardSidebar
-----------------

methods:
	init
	add_section(opts = {
		id:
		label:
		btn_label:
		add: <function>
	})
	set_message(<message>, type=[error, success, warning])

*/

function WhiteboardSidebar() {
	var me = this;
	$.extend(me, {
		init: function() {
			me.make();
			me.set_events();
		},
		make: function() {
			$('.span5').empty().html('<div class="sidebar round">\
				<div class="sections">\
					<div class="sidebar_section" id="wb_login" style="margin-top: 0px">\
					</div>\
					<div class="sidebar_section" id="wb_share">\
						<button class="btn small">Add</button>\
						<h5>Shared With</h5>\
						<div class="items"></div>\
						<div class="no_items help-block">Private</div>\
					</div>\
					<div class="sidebar_section" id="wb_list">\
						<button class="btn small">New</button>\
						<h5>My Whiteboards</h5>\
						<div class="items"></div>\
						<div class="no_items help-block">None saved yet</div>\
					</div>\
				</div>\
			</div>\
			<div id="message_area">\
			</div>');
			if($.session)
				me.setup_sections();
		},
		
		set_events: function() {
			// make the sidebar
			$(document).bind('login', function() {
				app.sidebar && app.sidebar.make();
			});
			$(document).bind('logout', function() {
				app.sidebar && app.sidebar.make();
			});
		},
		
		setup_sections: function() {
			$section = $('#wb_login').css('display', 'block');
						
			if(!$.session.user || $.session.user=='guest') {
				// guest must either login or register
				$section.html('<a href="#signin">Login</a> or \
					<a href="#register">Register</a> to save this whiteboard');
			} else {
				// save
				$section.html('<a href="#" id="save_whiteboard">Save</a> this whiteboard');
				$('#save_whiteboard').click(function() {
					app.wb.save(true);
					return false;
				});
				me.wblist = new WhiteboardList(me);
			}			
		},
		set_message: function(msg, type) {
			$('#message_area').html('<div class="alert-message block-message round '
				+(type || '')+'">'+msg+'</div>')
				.find(".alert-message")
				.delay(type=='error' ? 7000 : 3000)
				.fadeOut();
		}		
	});
	me.init();
}