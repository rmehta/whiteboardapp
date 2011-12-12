/*
Whitboard list
--------------

properties:

methods:
	init
	add_item
	delete_item
	refresh
*/

function WhiteboardList() {
	var me = this;
	$.extend(me, {
		init: function() {
			$('#wb_list').css('display', 'block');
			$('#wb_list .btn').click(function() {
				app.wb.clear();
			});

			// refresh whiteboard list on save
			$('#whiteboard').bind('wbsave', function() {
				app.sidebar.wblist.refresh();
			});
		},
		refresh: function() {
			$.call({
				method: "controllers.helpers.mywblist",
				success: function(data) {
					if(!data.result.length) return;
					
					// make a new section for whiteboard lists
					$('#wb_list .items').empty();

					// render the results
					$.each(data.result, function(i, item) {
						me.add_item(item)
					});

				}
			});
		},
		add_item: function(item) {
			$('#wb_list .no_items').css('display', 'none');

			// make a new whiteboard list entry
			$('#wb_list .items').append($.rep('<div>\
				<a href="#whiteboard/%(name)s">%(label)s</a>\
				<a class="close" href="#">×</a>\
			</div>', item));

			// delete whiteboard
			$('#wb_list .items .close:last').click(function() {
				me.delete_item(this); 
			})[0].wbname = item.name;			
		},
		
		delete_item: function(btn) {
			$.call({
				method:'lib.py.objstore.delete',
				type:'POST',
				data: {type:"whiteboard", name: btn.wbname},
				success: function(r) {
				if(r.message=='ok')
					$(btn).parent().fadeOut();
				},
			});
			return false;
		}
	})
	me.init();
	me.refresh();
}
