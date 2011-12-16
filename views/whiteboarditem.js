/*
Whiteboard Item
---------------

Usage:
new WhiteboardItemView(item)

Properties:
color
font
content

Style
wb_item

*/

var WhiteboardItemView = Class.extend({
	init: function(item) {
		if(!item) 
			item = {color:app.color, font:app.font, content:''};
			
		this.item = item;
		this.make();
		this.controller = new WhiteboardItemController(this);
	},
	make: function() {
		if(this.item.islabel) {
			// label, already there in the layout,
			// no need to make again
			this.$item = $('#wblabel');
		} else {
			if(!this.item.content) this.item.content = '';
			$('.wbitems').append($.rep('<div \
				class="wbitem pen-color-%(color)s pen-font-%(font)s">\
				%(content)s</div>', this.item));

			this.$item = $('.wbitems .wbitem:last');				
		};	
	},
	make_editable: function() {
		if(this.$item.find('input').length) return;
		this.update_pen_style();
		
		// create_input
		var txt = $.trim(this.$item.text());
		$(this.$item)
			.html('<input class="edit_wbitem" type="text" value="'+txt+'">')
			.find('.edit_wbitem')
			.focus()
			.select();
		app.wb.dirty = 1;
	},

	// remove all font and color classes
	// add the global class
	update_pen_style: function() {
		if(this.item.islabel) return;
		
		this.remove_pen_style();
		// add latest style
		this.$item.addClass('pen-font-' + app.pen_font);
		this.$item.addClass('pen-color-' + app.pen_color);			
	},

	remove_pen_style: function() {
		var me = this;
		$.each(this.$item.classList(), function(i, className) {
			if(className.substr(0,4)=='pen-')
				me.$item.removeClass(className)
		});		
	}

});

var WhiteboardItemController = Class.extend({
	init: function(view) {
		this.view = view;
		this.editable_on_click();
		this.read_only_on_blur();
		this.move_events();
	},
	editable_on_click: function() {
		var me = this;
		this.view.$item.click(function() {
			me.view.make_editable();
			app.wb.new_item();	
		});		
	},
	read_only_on_blur: function() {
		this.view.$item.delegate('input', 'blur', function() {
			app.wb.dirty = 1;
			
			// blank? remove the block
			if(!$(this).val()) { 
				$(this).parent().remove();
			} else {
				$(this).parent().html($(this).val());				
			}
		});
	},
	move_events: function() {
		var me = this;
		this.view.$item.delegate('input', 'keydown', function(event) {
			// up
			if(event.which==38) {
				if(me.view.item.islabel) {
					$('#whiteboard .wbitem:last').click();							
				} else {
					$(this).parent().prev().click();														
				}
			}

			// down
			if(event.which==13 || event.which==40) {
				if(me.view.item.islabel) {
					$('#whiteboard .wbitem:first').click();							
				} else {
					$(this).parent().next().click();														
				}
			}
		});	
	}
});