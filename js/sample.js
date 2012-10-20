

$('div[data-role=page]').live('pagecreate', function(){
	var page = $(this);
	$('#amida').amida();
});

var layout = function(){
	var footer = $('.footer');
	var windowHeight = $(window).height();
	var footerBottom = footer.offset().top + footer.height();
	var content = $('div[data-role=content]');
	if (windowHeight > footerBottom) {
		content.height(content.height() + (windowHeight - footerBottom));
	}
}
$('div[data-role=page]').live('pageshow', function(){
	var page = $(this);
	layout();
	$(window).resize(function(){
		layout();
	});
	
});
