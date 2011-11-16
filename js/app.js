$(document).ready(function() {
	// empty div at the end
	// if there are no empty items
	var add_empty_div = function() {
		if(!$('.wbitems .wbitem:empty').length) {
			$('.wbitems').append('<div class="wbitem"></div>');
		}
	}

	// edit item on click
	// if already in edit state, do nothing
	$('.wbitems').delegate('div.wbitem','click', function() {
		if($(this).find('input').length) return;
		
		var txt = $.trim($(this).text());
		$(this).html('<input class="edit_wbitem" type="text" value="'+txt+'">')
			.find('.edit_wbitem').focus();
	});
	
	// set text on blur
	// if text is empty, remove the item
	$('.wbitems').delegate('input.edit_wbitem', 'blur', function() {
		if(!$(this).val()) {
			$(this).parent().remove();
			add_empty_div();
			return;
		}
		$(this).parent().html($(this).val());
		add_empty_div();
	});
	
});

// make the sidebar
$(document).bind('session_load', function() {
	// hide the default login button
	//$('.topbar .nav.secondary-nav').css('display','none');
	
	if($.session.user=='guest') {
		// guest must either login or register
		$('.sidebar').html('<a href="#signin">Login</a> or \
			<a href="#register">Register</a> to save this whiteboard');
	}
})

