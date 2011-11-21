// register plugins
$._plugins.whiteboard = {path:'plugins/'}
$.index = 'whiteboard';

$(document).ready(function() {
	$('.brand').attr('href','#whiteboard');	
});

$(document).bind('logout', function() {
	window.location.reload(1);
})