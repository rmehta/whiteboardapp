$.require('views/whiteboarditem.js');
$.require('views/whiteboarduser.js');

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
			$.view.open('whiteboard');
		});
	},
	set_user_defaults: function() {
		var user = $.session.userobj;
		if(user.pen_font) {
			$('input[name="penfont"][value="'+user.pen_font+'"]').click();			
		}
		if(user.pen_color) {
			$('input[name="pencolor"][value="'+user.pen_color+'"]').click();
		}
		if(user.last_whiteboard) {
			$.view.open('whiteboard/' + user.last_whiteboard);			
		}
	},
	load: function() {
		var route = location.hash.split('/');
		var me = this;
		
		if(route.length > 1) {
			$('#wblabel').html('Loading "'+route[1]+'"...')
			$('.wbitems').empty();
			$.objstore.get("whiteboard", route[1], function(obj) {
				if(!obj.name) {
					app.sidebar.set_message('Whiteboard does not exist', 'error')						
					return;
				}
				me.render_view(obj);
			}, function(response) {
				app.wb.reset();
				app.sidebar.set_message('Whiteboard was private', 'error')
			})
		}
	},
	render_view: function(obj) {
		this.view.reset();
		app.cur_wb = obj;
		
		this.set_title(obj);
		this.set_items(obj);
		this.view.userlist.controller.refresh(obj.whiteboarduser);
	},
	set_title: function(obj) {
		// set label
		this.view.label(obj.label || obj.name);
		this.view.name(obj.name)
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
		var me = this;
		
		// set name and determine action
		action = this.model.isnew(obj) ? 'insert' : 'update';
		
		$.objstore[action](obj, function(data) {
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
			this.view.dirty = false;
		}
		this.set_autosave();
	},
	set_autosave: function() {
		setTimeout('app.wb.controller.autosave()', 5000);		
	}
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
			"owner":$.session.user,
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
			app.sidebar.set_message('Must give a name!', 'error');
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
		$('.wbitems .wbitem').each(function(i, div) {
			$item = $(div);
			classList = $item.classList();
			var item = {
				content: $.trim($item.text()),
				color: $.get_item_beginning_with(classList, 'pen-color').substr(10),
				font: $.get_item_beginning_with(classList, 'pen-font').substr(9)
			};
			if(item.content)
				obj.item.push(item);					
		});		
	},
	get_users: function(obj) {
		$('#wbuserlist .wb_user').each(function(i, div) {
			if($(div).text())
				obj.whiteboarduser.push({"user": $.trim($(div).text())})
		});				
	}
});