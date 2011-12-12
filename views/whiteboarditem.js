/*
Whiteboard Item
---------------

*/

function WhiteboardItem(item) {
	// new object
	if(!item) item = {color:app.color, font:app.font, content:''};
	var me = this;
	$.extend(this, {
		init: function() {
			if(item.islabel) {
				// label, already there in the layout,
				// no need to make again
				me.$item = $('#wblabel');
			} else {
				if(!item.content) item.content = '';
				$('.wbitems').append($.rep('<div \
					class="wbitem pen-color-%(color)s pen-font-%(font)s">\
					%(content)s</div>', item));

				me.$item = $('.wbitems .wbitem:last');				
			}
			me.set_events();
		},
		
		// remove all font and color classes
		// add the global class
		update_style_classes: function() {
			if(item.islabel) return;
			
			// remove style
			$.each(me.$item.classList(), function(i, className) {
				if(className.substr(0,4)=='pen-')
					me.$item.removeClass(className)
			});
			
			// add latest style
			me.$item.addClass('pen-font-' + app.pen_font);
			me.$item.addClass('pen-color-' + app.pen_color);			
		},
		set_events: function() {
			me.$item.click(function() {
				me.make_editable();
			});
		},
		make_editable: function() {
			if(me.$item.find('input').length) return;
			me.update_style_classes();
			
			// create_input
			var txt = $.trim(me.$item.text());
			$(me.$item).html('<input class="edit_wbitem" type="text" value="'+txt+'">')
				.find('.edit_wbitem').focus();
				
			// next item on "enter"
			me.$item.find('input').keydown(function(event) {
				if(event.which==13) {
					if(item.islabel) {
						$('#whiteboard .wbitem:first').click();							
					} else {
						$(this).parent().next().click();														
					}
				}
			}).blur(function() {me.make_readonly(this);});
		},
		make_readonly: function(input) {
			app.wb.dirty = 1;
			
			if(!$(input).val()) {
				// blank? remove the block
				$(input).parent().remove();
				app.wb.new_item();
				return;
			}
			$(input).parent().html($(input).val());
			app.wb.new_item();
		}
	});
	me.init();
}
