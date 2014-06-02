$(document).ready(function() {
	$('.headshots a').on('click', function (e) {
		e.preventDefault();
		$('.bio').slideDown('400', function() {
			
		});
	});
	$('.bio .exit').on('click', function (e) {
		e.preventDefault();
		$('.bio').slideUp('400', function () {
			
		});
	});
});