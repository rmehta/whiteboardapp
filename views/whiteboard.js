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

function Whiteboard() {
	var me = this;
	$.extend(me, {		
		// add delegate events
		// on click, make the item editable
		// on blur, 
		// 		make it static
		//		if empty, remove it
		//		add empty item (for new) if missing
		init: function() {
			// objectify label
			new WhiteboardItem({islabel:true})
			
			me.set_login_logout();
			
			$('#whiteboard .wbitems').sortable();
			$('#whiteboard .wbitems').disableSelection();

			// render whiteboard on load
			$('#whiteboard').bind('_make', function() {
				setTimeout('app.wb.autosave()', 5000);
			});

			// load the whiteboard on show
			$('#whiteboard').bind('_show', function() {
				app.wb.load();
			});
			
			me.shared = new WhiteboardUser();
		},
		
		set_login_logout: function() {
			$(document).bind('login', function() {
				// switch to last whiteboard, or new
				if($.session.user=='guest') {
					me.clear();
				} else {
					$.view.open('whiteboard/' + $.session.userobj.last_whiteboard);
				}
			});
			
			$(document).bind('logout', function() {
				me.clear();
			});
		},

		// empty div at the end
		// if there are no empty items
		new_item: function() {
			if(!$('.wbitems .wbitem:empty').length) {
				new WhiteboardItem();
			}
		},
				
		// extract the obj from the view
		getobj: function() {
			var label = $('#wblabel').text();
			if(!label) {
				app.sidebar.set_message('Must give a name!', 'error');
				return;
			}
			if($('.wbitems .wbitem').length==1) {
				app.sidebar.set_message("Can't save empty whiteboard", "error");
				return;
			}
			var obj = {
				"type":"whiteboard",
				"owner":$.session.user,
				"label": label,
				"item":[],
				"whiteboarduser":[]
			}
			
			me.append_items_and_users(obj);
			return obj;			
		},

		// check if the item has a name,
		// if not, set a new name and return true
		// or return false
		isnew: function(obj) {
			obj.name = $('#wblabel').attr('name');
			if(!obj.name) {
				var label = $('#wblabel').text();
				obj.name = $.session.user + '-' + label.replace(/[^\w\d]+/g, '_').toLowerCase();
				return true;
			}
			return false;
		},
				
		append_items_and_users: function(obj) {
			$('.wbitems .wbitem').each(function(i, div) {
				if($(div).text()) {
					$item = $(div);
					classList = $item.classList();
					var item = {
						content: $.trim($item.text()),
						color: $.get_item_beginning_with(classList, 'pen-color').substr(10),
						font: $.get_item_beginning_with(classList, 'pen-font').substr(9)
					};
					if(item.content)
						obj.item.push(item);					
				}
			});
			$('#wb_share .wb_user').each(function(i, div) {
				if($(div).text())
					obj.whiteboarduser.push({"user": $.trim($(div).text())})
			});				
		},
		
		// extract label, name and items
		// from the whiteboard html
		// check if label and items are present
		save: function(manual) {
			if($.session.user=='guest') return;
			var obj = me.getobj();
			
			// set name and determine action
			action = me.isnew(obj) ? 'insert' : 'update';
			
			$.objstore[action](obj, function(data) {
				if(data.message && data.message == 'ok') {
					// called manually, show a response
					if(manual) {
						app.sidebar.set_message('Saved', "success");						
					}
					$('#whiteboard').trigger('wbsave');
					$('#wblabel').attr('name', obj.name);
				} else {
					app.sidebar.set_message(data.error ? data.error : 'Unknown Error', 'error');
				}
			});	
		},
		
		autosave: function() {
			if(me.dirty) {
				me.save();
				me.dirty = false;
			}
			setTimeout('app.wb.autosave()', 5000);
		},
		
		clear: function() {
			$('#wblabel').html('New Whiteboard').attr('name', '');
			$('.wbitems').empty();
			new WhiteboardItem({'content':'Welcome to the whiteboard app'});
			new WhiteboardItem({'content':'Click me to edit'});
			new WhiteboardItem({'content':'Enjoy'});
			me.new_item();
		},
		
		load: function() {
			$('#wb_shared').css('display', 'none');
			var route = location.hash.split('/');
			if(route.length > 1) {
				$('#wblabel').html('Loading "'+route[1]+'"...')
				$('.wbitems').empty();
				$.objstore.get("whiteboard", route[1], function(obj) {
					if(!obj.name) {
						app.wb.clear();
						app.sidebar.set_message('Whiteboard does not exist', 'error')						
						return;
					}	
									
					// set label
					$('#wblabel').html(obj.label || obj.name).attr("name", obj.name);
					
					// set items
					if(obj.item) {
						$.each(obj.item, function(i, item) {
							new WhiteboardItem(item)
						});						
					}
					
					// the empty line (new)
					me.new_item();
					
					// shared with
					me.shared.refresh(obj.whiteboarduser);
				}, function(response) {
					app.wb.clear();
					app.sidebar.set_message('Whiteboard was private', 'error')
				})
			}
		}
	})
	me.init();
}