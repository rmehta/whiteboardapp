// register plugins
$._views.whiteboard = {path:'views/'}
$.index = 'whiteboard';

$(document).ready(function() {
	$('.brand').attr('href','#whiteboard');	
});

$(document).bind('logout', function() {
	window.location.reload(1);
});