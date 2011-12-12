/*
WhiteboardUser
----------------

properties:

methods:
	init
	saveobj (called internally after user adds a new user)
	refresh
*/

function WhiteboardUser() {
	var me = this;
	$.extend(me, {
		init: function() {
			$('#wb_share .btn').click(function() {
				$.require('lib/js/form.js');

				// form to add a user
				$.modal_form({
					label:"Add a user",
					id: "wb_modal_share",
					fields: [
						{
							type: "text",
							range: "user",
							name: "user",
							label: "Username",
							help: "Must be a registered user"
						}
					],
					saveobj: me._saveobj
				});
				$("#wb_modal_share").modal('show');
				return false;
			});
			
			$('#wb_share').delegate('a.close', 'click', function() {
				$(this).parent().fadeOut(function() {
					$(this).empty();
					if(!$('#wb_share .wb_user').length) {
						$('#wb_share .no_items').css('display', 'block');					
					}
					app.wb.dirty = true;					
				});
				return false;
			})
		},

		// add it to the current user
		_saveobj: function(obj) {
			
			// check double entry
			if($('#wb_share [data-name="'+obj.user+'"]').length) {
				$('#wb_modal_share').set_message('Already added', 'important', 1000);
				return;				
			}
			
			// check self
			if(obj.user==$.session.user) {
				$('#wb_modal_share').set_message('You are already using', 'important', 1000);
				return;
			}
			me.add_item(obj);
			app.wb.dirty = true;
			$("#wb_modal_share").modal('hide');
		},
		
		add_item: function(obj) {
			var img = '';
			if(obj.email) {
				// get gravatar
				$.require('lib/js/md5.js');
				var img = '<img src="http://www.gravatar.com/avatar/'
					+hex_md5(obj.email)
					+'?s=28" style="margin-right: 8px; margin-bottom: -9px"/>'
			}
			
			$('#wb_share .no_items').css('display', 'none');
			$('#wb_share .items').append($.rep('<div>'+img+
				'<span class="wb_user">%(user)s</span>\
				<a class="close" href="#">×</a>\
			</div>', obj));
		},
		
		refresh: function(users) {
			$('#wb_share').css('display', 'block');
			$('#wb_share .no_items').css('display', 'block');
			$('#wb_share .items').empty();
			if(users) {
				$.each(users, function(i, user) {
					me.add_item(user);
				})
			}
			
		}
	});
	me.init();
}
