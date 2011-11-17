// register plugins
$._plugins.whiteboard = {path:'plugins/'}
$.index = 'whiteboard';

$(document).ready(function() {
	$('.brand').attr('href','#whiteboard');	
});

// make the sidebar
$(document).bind('session_load', function() {
	// hide the default login button
	//$('.topbar .nav.secondary-nav').css('display','none');
	
	if($.session.user=='guest') {
		// guest must either login or register
		$('.sidebar').html('<a href="#signin">Login</a> or \
			<a href="#register">Register</a> to save this whiteboard');
	} else {
		$('.sidebar').html('<a href="#" id="save_whiteboard">Save</a> this whiteboard');
		$('#save_whiteboard').click(function() {
			var label = $('.wblabel').text();
			if(!label) {
				alert('Must give a name!');
				return;
			}
			if(!$('.wbitems .wbitem').length) {
				alert("Can't save empty whiteboard");
				return;
			}
			
			var obj = {
				"type":"whiteboard",
				"owner":$.session.user,
				"name": label.replace(/[^\w\d]+/g, '_').toLowerCase(),
				"label": label,
				"item":[]
			}
			$('.wbitems .wbitem').each(function(i, div) {
				obj.item.push({"content": $(div).text()})
			});
			
			$.objstore.post(obj, function() {
				alert('saved!')
			})
		})
	}
});