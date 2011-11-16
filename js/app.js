$(document).ready(function() {
	// empty div at the end if reqd
	var add_empty_div = function() {
		if(!$('.wbitems .wbitem:empty').length) {
			$('.wbitems').append('<div class="wbitem"></div>');
		}
	}

	// select item
	$('.wbitems').delegate('div.wbitem','click', function() {
		if($(this).find('input').length) return;
		
		var txt = $(this).text().replace(/^\s*/, '').replace(/\s*$/, '');
		$(this).html('<input class="edit_wbitem" type="text" value="'+txt+'">')
			.find('.edit_wbitem').focus();
	});
	
	// deselect item
	$('.wbitems').delegate('input.edit_wbitem', 'blur', function() {
		if(!$(this).val()) {
			$(this).parent().remove();
			add_empty_div();
			return;
		}
		$(this).parent().html($(this).val());
		add_empty_div();
	});
	
})