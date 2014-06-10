$(document).ready(function() {

	// full bio functionality
	$('.readMore').on('click', function (e) {
		e.preventDefault();
		$(this).siblings().filter('.bio').slideDown('400', function() {
			$(this).siblings().filter('.readMore').hide();
			$(this).siblings().filter('.readLess').show();
		});
	});
	$('.readLess').on('click', function (e) {
		e.preventDefault();
		$(this).siblings().filter('.bio').slideUp('400', function() {
			$(this).siblings().filter('.readMore').show();
			$(this).siblings().filter('.readLess').hide();
		});
	});

	// alternate language functionality
	$('.readEnglish').on('click', function(e) {
		e.preventDefault();
		$('.german').fadeOut('400', function() {
			$('.english').fadeIn('400', function() {
				
			});
		});
	});
	$('.readGerman').on('click', function(e) {
		e.preventDefault();
		$('.english').fadeOut('400', function() {
			$('.german').fadeIn('400', function() {
				
			});
		});
	});

	$('.readEnglish').focus();

});