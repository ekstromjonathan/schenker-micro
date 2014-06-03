$(document).ready(function() {
	$('.readMore').on('click', function (e) {
		e.preventDefault();
		console.log($(this).siblings().filter('.bio'))
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

});