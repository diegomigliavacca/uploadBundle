//  link toggle after selecting track to zoom
$("a.link").click(function() {
	$("a.link").css("color", "#0088cc");
	$(this).css("color", "tomato");
}, function() {
	$(this).css("color", "tomato");
	$(this).css("color", "#0088cc");
});
