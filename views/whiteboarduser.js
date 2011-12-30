/*
Whiteboard User List
--------------------

Usage:

1. Create new List
new WhiteboardUserListView()

2. Refresh List
whiteboarduserview.controller.refresh(obj)

Contains:
- modal to add user
- controller to refresh

Style:
#wbuserlist
.wb_user
*/

var WhiteboardUserListView = Class.extend({
	init: function() {
		this.make();
		this.controller = new WhiteboardUserListController(this);
	},
	make: function() {
		//
	},
	add_user: function(obj) {
		var img = obj.email ? $.get_gravatar(obj.email) : '';

		// hide "no_items"
		$('#wbuserlist .no_items').css('display', 'none');
		
		obj.label = obj.user;
		if(obj.user==$.session.user) {
			obj.label = obj.user + ' (me)';
		}
		
		// add item
		$('#wbuserlist .items').append($.rep('<div>'+img+
			'<span class="wb_user" data-user="%(user)s">%(label)s</span>\
			<a class="close" href="#">×</a></div>', obj));
	},
	remove_user: function(ele) {
		$(ele).parent().fadeOut(function() {
			$(ele).empty();
			if(!$('#wblist .wb_user').length) {
				$('#wblist .no_items').css('display', 'block');					
			}
		});
		
	},
	reset: function() {
		$('#wbuserlist').css('display', 'block');
		$('#wbuserlist .no_items').css('display', 'block');
		$('#wbuserlist .items').empty();		
	}
});


// Controller
var WhiteboardUserListController = Class.extend({
	init: function(view) {
		this.view = view;
		this.show_modal_on_add();
		this.remove_from_list();
	},
	show_modal_on_add: function() {
		var me = this;
		$('#wbuserlist button.btn').bind('click', function() {
			if(!me.addusermodalview)
				me.addusermodalview = new WhiteboardAddUserModalView();
			me.addusermodalview.show();
		});
	},
	remove_from_list: function() {	
		// remove user
		// this will be saved along with
		var me = this;
		$('#wblist').delegate('a.close', 'click', function() {
			app.wb.controller.dirty(true);
			me.view.remove_user(this);
			return false;
		})
	},
	refresh: function(users) {
		this.view.reset()
		var me = this;
		if(users) {
			$.each(users, function(i, user) {
				me.view.add_user(user);
			})
		}
	}
});


// Add user Modal
$.require('lib/chaijs/form/modal.js');
var WhiteboardAddUserModalView = FormModalView.extend({
	init: function() {
		this._super({
			label:"Add a user",
			id: "wb_modal_share",
			fields: [
				{
					type: "text", range: "user", name: "user", label: "Username",
					help: "Must be a registered user"
				}
			]
		});
	},
	primary_action: function() {
		// check double entry
		var obj = this.get_values();
		if($('#wb_share [data-name="'+obj.user+'"]').length) {
			this.set_message('Already added', 'important', 3000);
			return;				
		}
		
		// check if not owner
		if(app.cur_wb && obj.user == app.cur_wb.owner) {
			this.set_message('Owner does not need sharing rights', 'important', 3000);
			return;
		}
		app.wb.userlist.add_user(obj);
		app.wb.controller.dirty(true);
		this.$modal.modal('hide');
	}
})
