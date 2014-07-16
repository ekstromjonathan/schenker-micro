$(document).ready(function() {

	// full bio functionality
	$('.readMore').on('click', function (e) {
		e.preventDefault();
		$(this).siblings('.summary').animate({height: '100%'});
		$(this).siblings('.showMore').slideDown('400', function() {
			$(this).siblings('.readMore').hide();
			$(this).siblings('.readLess').show();
		});
	});
	$('.readLess').on('click', function (e) {
		e.preventDefault();
		$(this).siblings('.showMore').slideUp('400', function() {
			$(this).siblings('.readMore').show();
			$(this).siblings('.readLess').hide();
			$(this).siblings('.summary').removeAttr('style');
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

	if ($('.readEnglish')[0]) {
		var x = window.scrollX, y = window.scrollY;
		$('.readEnglish').focus();
		window.scrollTo(x, y);
	}

	// infographic popup
	$('.infographic-scroller').height(window.innerHeight);
	$('.infographic').on('click', function(e) {
		e.preventDefault();
		$('#infographic.infographic-wrapper').fadeIn('400', function() {
			
		});
	});
	// coming soon
	$('.coming-soon').on('click', function(e) {
		e.preventDefault();
		$('#coming-soon.infographic-wrapper').fadeIn('400', function() {
			
		});
	});

	$('.exit').on('click', function(e) {
		$('.infographic-wrapper').fadeOut('400', function() {
			
		});
	});

	// jwplayer
	jwInit();

});

function jwInit () {
	jwplayer('playerelBWIkcORVCp').setup({
        file: 'https://s3-us-west-2.amazonaws.com/schenker-panam/07_Commonwealth_Games_Melburne_2006_English.mp4',
        image: 'images/melburne.png',
        title: 'Commonwealth Games Melburne',
        width: '100%',
        aspectratio: '16:9'
    });

    jwplayer('playeriMApWBBnCfya').setup({
        file: 'https://s3-us-west-2.amazonaws.com/schenker-panam/10_Volvo_Ocean_Race_2005-20016_English.mp4',
        image: 'images/volvo.png',
        title: 'Volvo Ocean Race',
        width: '100%',
        aspectratio: '16:9'
    });

    jwplayer('playerJpKfVeMsGkdg').setup({
        file: 'https://s3-us-west-2.amazonaws.com/schenker-panam/15_Schenker_Global_Sports_Events_English.mp4',
        image: 'images/schenker-sports.png',
        title: 'Schenker Global Sports Events',
        width: '100%',
        aspectratio: '16:9'
    });
}