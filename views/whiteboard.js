$.require('whiteboardapp/views/whiteboarditem.js');
$.require('whiteboardapp/views/whiteboarduser.js');

// from a `list` of strings,
// returns the first item beginning with the given `txt`
(function($) {
	$.get_item_beginning_with = function(list, txt) {
		for(var i=0;i<list.length;i++) {
			var val = list[i];
			if(val.substr(0, txt.length)==txt) {
				return val;
			}			
		}
		return '';
	}
})(jQuery);

/*
Whiteboard
----------
methods:
	init:
	save:
	load:
	clear:
*/

var WhiteboardView = Class.extend({
	init: function() {
		this.labelview = new WhiteboardItemView({islabel:true});
		this.userlist = new WhiteboardUserListView();
		this.controller = new WhiteboardController(this);
		this.make_list_sortable();
	},
	make_list_sortable: function() {
		$('#whiteboard .wbitems').sortable();
		$('#whiteboard .wbitems').disableSelection();		
	},
	reset: function() {
		this.label('New Whiteboard');
		this.name('');
		this.owner($.session.user);
		$('.wbitems').empty();
	},
	new_whiteboard: function() {
		this.reset();
		new WhiteboardItemView({'content':'Welcome to the whiteboard app'});
		new WhiteboardItemView({'content':'Click me to edit'});
		new WhiteboardItemView({'content':'Enjoy'});
		this.new_item();		
	},
	// addempty item at the end of the list (if reqd)
	new_item: function() {
		if(!$('.wbitems .wbitem:empty').length) {
			new WhiteboardItemView();
		}
	},
	label: function(txt) {
		return $('#wblabel').text(txt);
	},
	name: function(txt) {
		return $('#wblabel').attr('name', txt);
	},
	owner: function(txt) {
		return $('#wblabel').attr('data-owner', txt);
	}
});


// Controller
var WhiteboardController = Class.extend({
	init: function(view) {
		this.view = view;
		this.model = new WhiteboardModel(view, this);
		this.load_model();
		this.user_change();
	},
	load_model: function() {
		var me = this;
		$('#whiteboard').bind('_show', function() {
			me.load();
		})
	},
	user_change: function() {
		var me = this;
		$(document).bind('login', function() {
			// switch to last whiteboard, or new
			if($.session.user=='guest') {
				me.view.new_whiteboard();
			} else {
				me.set_user_defaults();
			}
		});
		
		$(document).bind('logout', function() {
			me.view.new_whiteboard();
			chai.view.open('whiteboard');
		});
	},
	set_user_defaults: function() {
		if($.session.userobj.pen_color) {
			$('.color-selector[data-color="'+ $.session.userobj.pen_color+'"]').click();
		}
		this.open_last();
	},
	open_last: function() {
		if($.session.userobj.last_whiteboard) {
			chai.view.open('#whiteboard/' + $.session.userobj.last_whiteboard);			
		}
	},
	load: function() {
		var route = location.hash.split('/');
		var me = this;
		
		if(route.length > 1) {
			$('#wblabel').html('Loading "'+route[1]+'"...')
			$('.wbitems').empty();
			chai.objstore.get("whiteboard", route[1], function(obj) {
				if(!obj.name) {
					app.sidebar.set_message('Whiteboard does not exist', 'error')						
					return;
				}
				$.session.userobj.last_whiteboard = obj.name;
				me.render_view(obj);
			}, function(response) {
				app.wb.reset();
				app.sidebar.set_message('Whiteboard was private', 'error')
			})
		}
	},
	render_view: function(obj) {
		this.view.reset();
		app.last_wb_name = app.cur_wb ? app.cur_wb.name : null;
		app.cur_wb = obj;
		
		this.set_title(obj);
		this.set_items(obj);
		this.view.userlist.controller.refresh(obj.whiteboarduser);
	},
	set_title: function(obj) {
		// set label
		this.view.label(obj.label || obj.name);
		this.view.name(obj.name);
		this.view.owner(obj.owner);
		document.title = 'Whiteboard: ' + obj.label || obj.name;		
	},
	set_items: function(obj) {
		$.each(obj.item || [], function(i, item) {
			new WhiteboardItemView(item)
		});
		
		// the empty line (new)
		this.view.new_item();		
	},
	save: function(manual) {
		if($.session.user=='guest') return;
		var obj = this.model.get();
		if(!obj) return;
		var me = this;
		
		// set name and determine action
		action = this.model.isnew(obj) ? 'insert' : 'update';
		
		chai.objstore[action](obj, function(data) {
			if(data.message && data.message == 'ok') {
				if(manual) {
					// called manually, show a response
					app.sidebar.set_message('Saved', "success");						
				}
				$('#whiteboard').trigger('wbsave');
				me.view.name(obj.name)
			} else {
				app.sidebar.set_message(data.error || 'Unknown Error', 'error');
			}
		});	
	},
	autosave: function() {
		if(this.view.dirty) {
			this.save(false);
			this.dirty(false);
		}
		this.set_autosave();
	},
	set_autosave: function() {
		setTimeout('app.wb.controller.autosave()', 5000);		
	},
	dirty: function(status) {
		app.wb.dirty = status;
		if(status) {
			$('#wb_login').removeClass('info').addClass('warning');
		} else {
			$('#wb_login').addClass('info').removeClass('warning');			
		}
	},
});


// model
var WhiteboardModel = Class.extend({
	init: function(view, controller) {
		this.view = view;
		this.controller = controller;
	},
	// extract the obj from the view
	get: function() {
		if(!this.check_if_okay()) return;
		var obj = {
			"type":"whiteboard",
			"owner": this.view.owner(),
			"label": this.view.label(),
			"item":[],
			"whiteboarduser":[]
		}
		this.get_items(obj);
		this.get_users(obj)
		return obj;			
	},
	check_if_okay: function() {
		var label = this.view.label();
		if(!label) {
			//app.sidebar.set_message('Must give a name!', 'error');
			return;
		}
		if($('.wbitems .wbitem').length==1) {
			app.sidebar.set_message("Can't save empty whiteboard", "error");
			return;
		}
		return true;
	},
	isnew: function(obj) {
		obj.name = this.view.name();
		if(!obj.name) {
			var label = this.view.label();
			obj.name = $.session.user + '-' + label.replace(/[^\w\d]+/g, '_').toLowerCase();
			return true;
		}
		return false;
	},
	get_items: function(obj) {
		var me = this;
		$('.wbitems .wbitem').each(function(i, div) {
			$item = $(div);
			classList = $item.classList();
			var item = {
				content: me.get_item_content($item),
				color: $.get_item_beginning_with(classList, 'pen-color').substr(10),
				font: $.get_item_beginning_with(classList, 'pen-font').substr(9)
			};
			if(item.content)
				obj.item.push(item);					
		});		
	},
	get_item_content: function($item) {
		if($item.find('input').length) {
			return $item.find('input').val(); // editing
		} else {
			return $.trim($item.text()); // finished editing
		}	
	},
	get_users: function(obj) {
		$('#wbuserlist .wb_user').each(function(i, div) {
			if($(div).attr('data-user'))
				obj.whiteboarduser.push({"user": $.trim($(div).attr('data-user'))})
		});
	}
});