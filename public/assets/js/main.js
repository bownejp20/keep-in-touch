/*
 * Copyright (c) 2023 Frenify
 * Author: Frenify
 * This file is made for CURRENT THEME
*/


/*

	@Author: Frenify
	@URL: https://frenify.com/


	This file contains the jquery functions for the actual theme, this
	is the file you need to edit to change the structure of the
	theme.

	This files contents are outlined below.

*/


jQuery.fn.isInViewportByFrenify = function() {
	"use strict";
	var element 		= jQuery(this),
		windoww 		= jQuery(window);
    var elementTop 		= element.offset().top;
    var elementBottom 	= elementTop + element.outerHeight();

    var viewportTop 	= windoww.scrollTop();
    var viewportBottom 	= viewportTop;// + windoww.height();
	var percentage		= (viewportTop - elementTop)/element.outerHeight() * 100;
    return [(elementBottom > viewportTop) && (elementTop < viewportBottom),percentage];
};



var XoxoBody				= jQuery('body');
var XoxoWrapper				= jQuery('.xoxo-fn-wrapper');
var XoxoVoteWait			= false;
var XoxoReactionWait		= false;
var XoxoNextPostWait		= false;
var XoxoQuickNav			= 0;
var XoxoCounterAjaxPost		= 1;
var XoxoSearch				= {
	search: '',
	text: '',
	onlyTitle: false,
	onlyPost: false
};
var PoptioEntityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

// All other theme functions
(function ($){

	"use strict";
	
	
    var XoxoInit 		= {
		
		
		pageNumber: 1,
		
        init: function () {
			this.cursor();
			this.blog_info();
			this.url_fixer();
			this.hamburgerOpener__Mobile();
			this.submenu__Mobile();
			this.imgToSVG();
			this.isotopeMasonry();
			this.dataFnBgImg();
			this.dataFnStyle();
			this.prev_next_posts();
			this.widget__pages();
			this.widget__archives();
			this.portfolioContentHeight();
			this.inputCheckBoxInComment();
			
			
			this.totopWinScroll();
			this.widgetTitle();
			this.fixAdminBar();
			this.minHeightPages();
			this.countdown();
			
			// since xoxo
			this.ready();
			this.totopScroll();
			this.seachSomething();
			this.reversedMenu();
//			this.moreMenu();
			this.sidebarOpener();
			this.commentOpener();
			this.readMore2();
			this.voteOpener();
			this.footerPosts();
			this.reaction();
			this.featuredPostsWidget();
			this.ajaxNextPost();
			this.nowReading();
			this.transformReading();
			this.stickyHeader();
			this.stickyTopBar();
			this.newPlayer();
			this.mobile__Menu();
			this.single_post__gallery();
			this.getSidePopupPost();
			this.embedOpener();
			this.topQuickNav();
			this.blogPageFeatured();
        },
		
		shareWordHeight: function(){
			var share = $('.xoxo_fn_share h5');
			if(share.length){
				share.css({marginTop: (parseInt(share.find('span').width()) - 72) + 'px',opacity:1});
			}
		},
		
		blogPageFeatured: function(){
			var swiper = new Swiper(".swiper-container", {
				loop: true,
				speed: 1500,
				parallex:true,
				nav:true,
				autoplay:{
					delay: 5000,
					disableOnInteraction: false,
				},
				navigation: {
					nextEl: '.next',
					prevEl: '.prev',
				},
				slidesPerView: 1,				
				loopAdditionalSlides: 10,
				watchSlidesProgress: true,
				
			});
		},
		
		
		quickNavResize: function(){
			$('.fn__blog_anchor').css({top:'100%',left:'100%'});
		},
		
		handle_mousedown: function(e){
			var my_dragging = {};
			my_dragging.pageX0 = e.pageX;
			my_dragging.pageY0 = e.pageY;
			my_dragging.elem = this;
			my_dragging.offset0 = $(this).offset();

			function handle_dragging(e){
				var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
				var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
				$(my_dragging.elem).offset({top: top, left: left});
			}

			function handle_mouseup(){
				$('body')
				.off('mousemove', handle_dragging)
				.off('mouseup', handle_mouseup);
			}

			$('body')
			.on('mouseup', handle_mouseup)
			.on('mousemove', handle_dragging);
		},
		
		topQuickNav: function(){
			$('.fn__blog_anchor').mousedown(XoxoInit.handle_mousedown);
			$('.fn__blog_anchor .closer').off().on('click',function(){
				$('.fn__blog_anchor').removeClass('active').css({left: '100%'});
				XoxoBody.removeClass('blog-anchor-active');
				XoxoQuickNav = 0;
				return false;
			});
			
			var stickyH = 0;
			if($('.xoxo_fn_stickynav').length){
				stickyH = $('.xoxo_fn_stickynav').outerHeight();
			}
			
			$('.fn__blog_anchor .ba_item').off().on('click',function(){
				var id = $(this).data('id');
				$([document.documentElement, document.body]).animate({
					scrollTop: $('.xoxo_fn_blog_single[data-post-id="'+id+'"]').offset().top - 80 - stickyH
				}, 600);
			});
		},
		
		embedOpener: function(){
			var box = $('.fn__popupbox_iframe');
			var content = box.find('.iframe_content');
			$('.fn__video_popup,.fn__audio_popup').off().on('click',function(){
				var embed = $(this).siblings('.embed_code').html();
				content.html('').html(embed);
				box.addClass('active');
				return false;
			});
			box.find('.iframe_closer').off().on('click',function(){
				box.removeClass('active');
				setTimeout(function(){
					content.html('');
				},400);
				return false;
			});
		},
		
		single_post__gallery: function(){
			$('.fn__gallery_format .swiper-container').each(function(){
				var element				= $(this);
				if(!element.hasClass('ready')){
					element.addClass('ready');
					var parent			= element.closest('.fn__gallery_format');
					if(parent.parent().hasClass('post_top_format')){
						var height		= parent.data('l-height');
						if (window.matchMedia('(max-width: 768px)').matches){
							height		= parent.data('m-height');
						}
						parent.find('.item').css({height: height + 'px'});
					}
					// Main Slider
					var transform 			= 'Y';
					var direction 			= 'horizontal';
					var	interleaveOffset 	= 0.5;
					if(direction === 'horizontal'){
						transform 			= 'X';
					}
					var rate				= 1;
					if($('body').hasClass('rtl')){
						rate = -1;
					}
					// Main Slider
					var mainSliderOptions 	= {
						loop: true,
						speed: 1500,
						autoplay:{
							delay: 5000,
							disableOnInteraction: false,
						},
						navigation: {
							nextEl: parent.find('.next'),
							prevEl: parent.find('.prev'),
						},
						slidesPerView: 1,
						direction: direction,
						loopAdditionalSlides: 10,
						watchSlidesProgress: true,
						on: {
							init: function(){
								this.autoplay.stop();
							},
							imagesReady: function(){
								this.autoplay.start();
							},
							progress: function(){
								var swiper = this;
								for (var i = 0; i < swiper.slides.length; i++) {
									var slideProgress 	= swiper.slides[i].progress,
									innerOffset 		= swiper.width * interleaveOffset,
									innerTranslate 		= slideProgress * innerOffset * rate;
									$(swiper.slides[i]).find(".item").css({transform: "translate"+transform+"(" + innerTranslate + "px)"});
								}
							},
							touchStart: function() {
								var swiper = this;
								for (var i = 0; i < swiper.slides.length; i++) {
									swiper.slides[i].style.transition = "";
								}
							},
							setTransition: function(speed) {
								var swiper = this;
								for (var i = 0; i < swiper.slides.length; i++) {
									swiper.slides[i].style.transition = speed + "ms";
									swiper.slides[i].querySelector(".item").style.transition =
									speed + "ms";
								}
							}
						}
					};
					new Swiper(element, mainSliderOptions);
				}
					
			});
		},
		
		mobile__Menu: function(){
			var mobNav		= $('.xoxo_fn_mobnav');
			var trigger		= mobNav.find('.mobmenu_opener');
			var featured	= mobNav.find('.item_featured a');
			var mobBottom	= mobNav.find('.mob_bot');
			var featuredBar	= mobNav.find('.mob_featured_bar');
			trigger.off().on('click',function(){
				if(mobNav.hasClass('menu_opened')){
					mobNav.removeClass('menu_opened');
					mobBottom.slideUp();
				}else{
					mobNav.addClass('menu_opened').removeClass('featured_bar_opened');
					featuredBar.slideUp();
					mobBottom.slideDown();
				}
				return false;
			});
			featured.off().on('click',function(){
				if(mobNav.hasClass('featured_bar_opened')){
					mobNav.removeClass('featured_bar_opened');
					featuredBar.slideUp();
				}else{
					mobNav.addClass('featured_bar_opened').removeClass('menu_opened');
					mobBottom.slideUp();
					featuredBar.slideDown();
				}
				return false;
			});	
		},
		
		runPlayer: function(){
			var parent		= $('.xoxo_fn_main_audio');
			var audioVideo 	= parent.find('audio,video');
			audioVideo.each(function(){
				var element = $(this);
				if(parent.find('.mejs-audio').length){
					parent.find('.mejs-audio').remove();
				}
				element.mediaelementplayer({
					// Do not forget to put a final slash (/)
					pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
					// this will allow the CDN to use Flash without restrictions
					// (by default, this is set as `sameDomain`)
					shimScriptAccess: 'always',
//					features: ['playpause','skipback','jumpforward','progress','current','duration','tracks','volume'],
					features: ['skipback','jumpforward','progress','current','duration','tracks','volume'],
					skipBackInterval: 10,
					jumpForwardText: '10s',
					skipBackText: '10s',
					jumpForwardInterval: 10,
					classPrefix: 'mejs__',
					timeAndDurationSeparator: ' / ',
					audioVolume: 'vertical',
					success: function(mediaElement) {
						mediaElement.addEventListener('play', function() {
							parent.removeClass('fn_pause').addClass('fn_play');
						}, false);
						mediaElement.addEventListener('pause', function() {
							parent.removeClass('fn_play').addClass('fn_pause');
						}, false);
					},
				});
			});
		},
		
		newPlayer: function(){
			var audiobox			= $('.xoxo_fn_main_audio');
			var playButton			= $('.xoxo_fn_audio_button');
			var boxCloser 			= audiobox.find('.closer');
			var audioOpener 		= $('.xoxo_fn_audio_opener');
			var playOfAudiobox		= audiobox.find('.podcast_icon');
			var playPauseOfOpener 	= audioOpener.find('.icon_bar');
			var openBtn 			= audioOpener.find('.text');
			var closeBtn 			= audioOpener.find('.closer');
			var self				= this;
			
			self.runPlayer();
			
			// close button of audiobox on click action
			boxCloser.off().on('click', function(){
				
				if(audiobox.hasClass('fn_play')){
					// открыть кнопку "открыть"
					audiobox.addClass('closed');
					audioOpener.addClass('opened');
				}else{
					// action #shutup
					audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
					XoxoBody.removeClass('music-play');
					$('.fn__mp3_item.active').removeClass('fn_pause active fn_play');
				}
				return false;
			});
			
			// open button (fixed to right with equalizer) on click action
			openBtn.off().on('click', function(){
				// open audiobox
				audiobox.removeClass('closed');
				// close open button
				audioOpener.removeClass('opened');
				
				return false;
			});
			
			// Отключить все звуки и проигрыватель + закрыть кнопку "открыть"
			closeBtn.off().on('click', function(){
				audioOpener.removeClass('opened');
				
				// action #shutup
				audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
				XoxoBody.removeClass('music-play');
				$('.fn__mp3_item.active').removeClass('fn_pause active fn_play');
				
				return false;
			});
			
			// play/pause button of audiobox on click action
			playOfAudiobox.off().on('click', function(){
				if(audiobox.find('audio,video').length){
					if(audiobox.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						XoxoBody.addClass('music-play');
						$('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
					}else{
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						XoxoBody.removeClass('music-play');
						$('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
					}
				}
			});
			
			// play/pause button of "open" button on click action
			playPauseOfOpener.off().on('click', function(){
				if(audiobox.find('audio,video').length){
					if(audiobox.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						XoxoBody.addClass('music-play');
						$('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
					}else{
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						XoxoBody.removeClass('music-play');
						$('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
					}
				}
			});
			
			// play/pause button of mp3 in any place on click action
			playButton.off().on('click',function(){
				var button			= $(this);
				
				
				// if it is mp3 item
				if(button.closest('.fn__mp3_item').length){
					var mp3Item = button.closest('.fn__mp3_item');
					
					if(!mp3Item.hasClass('active')){
						$('.fn__mp3_item').removeClass('active fn_play fn_pause');
						mp3Item.addClass('active');
					}
					
					if(mp3Item.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						XoxoBody.addClass('music-play');
						mp3Item.removeClass('fn_pause').addClass('fn_play');
					}else if(mp3Item.hasClass('fn_play')){
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						XoxoBody.removeClass('music-play');
						mp3Item.removeClass('fn_play').addClass('fn_pause');
					}else{
						// action #new_play_mp3
						mp3Item.addClass('fn_play');
						audioOpener.removeClass('opened');
						XoxoBody.addClass('music-play');
						$('.xoxo_fn_main_audio .audio_player').html('<audio controls><source src="'+button.attr('data-mp3')+'" type="audio/mpeg"></audio>');
						self.runPlayer();
						setTimeout(function(){
							audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
						},50);
					}
				}else{
					button.addClass('fn_play');
					audioOpener.removeClass('opened');
					XoxoBody.addClass('music-play');
					$('.xoxo_fn_main_audio .audio_player').html('<audio controls><source src="'+button.attr('data-mp3')+'" type="audio/mpeg"></audio>');
					self.runPlayer();
					setTimeout(function(){
						audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
					},50);
				}
				
				return false;
			});
		},
		
		stickyTopBar: function(){
			var stickyHeader = $('.xoxo_fn_stickynav');
			if(stickyHeader.length){
				stickyHeader.on('mouseenter',function(){
					stickyHeader.addClass('hover');
				}).on('mouseleave',function(){
					stickyHeader.removeClass('hover');
				});
			}
		},
		
		stickyHeader: function(){
			var stickyHeader = $('.xoxo_fn_stickynav');
			if(stickyHeader.length){
				var scrollTop 	= $(window).scrollTop();
				if(scrollTop > $('.xoxo_fn_header').outerHeight() + 50){
					XoxoBody.addClass('sticky-active');
				}else{
					XoxoBody.removeClass('sticky-active');
				}
			}
		},
		
		transformReading: function(){
			var stickyHeader = $('.xoxo_fn_stickynav.ajax_enable');
			if(stickyHeader.length && XoxoBody.hasClass('single-post')){
				var lastScrollTop = 0;
				$(window).scroll(function(){
					var st = $(this).scrollTop();
					if (st > lastScrollTop){
						// downscroll
						stickyHeader.addClass('active');
					}
					lastScrollTop = st;
				});
			}
				
		},
		
		nowReading: function(){
			var title 		= $('.header_post_reading .reading_post .title');
			var progress 	= $('.xoxo_fn_stickynav .progress');
			$(window).on('resize scroll', function() {
				var bs 		= $('.xoxo_fn_blog_single');
				bs.each(function(){
					var e 	= $(this);
					var f 	= e.isInViewportByFrenify();
					var p	= f[1];
					if(f[0]){
						var newPostTitle = e.data('post-title');
						if(title.html() !== newPostTitle){
							title.html(e.data('post-title'));
						}
						var currentURL	= window.location.href;
						var newURL		= e.data('post-url');
						if(currentURL !== newURL){
							window.history.pushState("", newPostTitle, newURL);
						}
					}
					if(p >= 0 && p <= 100){
						progress.css({width: p + '%'});
					}
				});
			});	
		},
		
		getSidePopupPost: function(){
			var sidepp = $('.fn__fixed_bottom_post');
			if(sidepp.length){
				$(document).scroll(function() {
					var footerHeight =  $('#xoxo_fn_footer').length > 1 ?  $('#xoxo_fn_footer').outerHeight() : 0;
					if (((window.innerHeight + window.scrollY+400) >= document.body.offsetHeight - footerHeight) && !sidepp.hasClass('remove')) {
						sidepp.addClass('active');
					}
				});
				sidepp.find('.fbp_closer a').off().on('click',function(){
					sidepp.removeClass('active').delay(500).addClass('remove');
					return false;
				});
			}
		},
		
		ajaxNextPost: function(){
			var singlePost = $('.xoxo_fn_singleajax');
			if($('.xoxo_fn_singleajax').length && !XoxoNextPostWait){
				$(document).scroll(function() {
					if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - $('#xoxo_fn_footer').outerHeight()) {
						if(!XoxoNextPostWait){
							var single			= $('.xoxo_fn_blog_single');
							var ID 				= single.last().data('get-post-id');
							if(ID === ''){
								XoxoNextPostWait = true;
								XoxoBody.addClass('no-prev-post');
								return false;
							}
							XoxoBody.addClass('prev-post-loading');
							XoxoNextPostWait 	= true;
							var requestData 	= {
								action: 'xoxo_fn_get_prev_post', 
								ID: ID,
							};

							$.ajax({
								type: 'POST',
								url: XoxoAjax.ajax_url,
								cache: false,
								data: requestData,
								success: function(data) {
									XoxoQuickNav++;
									if(XoxoQuickNav === 1){
										$('.fn__blog_anchor').addClass('active');
										XoxoBody.addClass('blog-anchor-active');
									}
									var fnQueriedObj 	= $.parseJSON(data); //get the data object
									singlePost.append(fnQueriedObj.output);
									XoxoInit.init();
									XoxoNextPostWait = false;
									XoxoBody.removeClass('prev-post-loading');
									
									
									XoxoCounterAjaxPost++;
									var appendedElement = singlePost.children().last();
									var count = XoxoCounterAjaxPost < 10 ? '0' + XoxoCounterAjaxPost : XoxoCounterAjaxPost;
									$('.fn__blog_anchor ul').append('<li><div class="ba_item" data-id="'+appendedElement.data('post-id')+'"><span class="ba_count"><span>'+count+'</span></span><h4><span>'+appendedElement.data('post-title')+'</span></h4></div></li>');
									$('.fn__blog_anchor li').addClass('ready');
									XoxoInit.topQuickNav();
								},
								error: function(MLHttpRequest, textStatus, errorThrown) {
									console.log(MLHttpRequest);
									console.log(textStatus);
									console.log(errorThrown);
								}
							});
						}
					}
				});
			}
				
		},
		
		featuredPostsWidget: function(){
			$('.xoxo_fn_widget_featured .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var mainSliderOptions 	= {
					loop: true,
					speed: 1500,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					slidesPerView: 1,
					spaceBetween: 10,
					direction: 'horizontal',
					loopAdditionalSlides: 10,
					navigation: {
						nextEl: element.find('.nav .next'),
						prevEl: element.find('.nav .prev'),
				  	},
					watchSlidesProgress: true,
				};
				new Swiper(element, mainSliderOptions);
			});
		},
		
		footerPosts: function(){
			$('.xoxo_fn_vertical_slider').each(function(){
				var e = $(this);
				if(e.hasClass('ready')){
					return false;
				}
				e.addClass('ready');
				var vs = e.find('.vertical_slider');
				var vsHTML = vs.html();
				vs.html(vsHTML.repeat(3));
				XoxoInit.vs_changeslide(1,e);
				XoxoInit.vs_start(vs,e);
			});
		},
		
		vs_start: function(vs,element){
			var timeout 		= 6000;
			var time 			= null;
			clearInterval(time);
			time = setInterval(function(){
				var index 		= vs.find('.current').index() + 2;
				XoxoInit.vs_changeslide(index,element);
			}, timeout);
		},
		
		vs_changeslide: function(index,element){
			var vs 				= element.find('.vertical_slider'),
				children 		= vs.children('.item'),
				length			= children.length;
				index			= (index + length) % length;
			var el 				= children.eq(index-1);

			if(!el.hasClass('current')){
				children.removeClass('current next1 next2 prev1 prev2 next3 prev3');
				el.addClass('current');
				var next1_index = (index + 1) % length;
				var next2_index = (index + 2) % length;
				var next3_index = (index + 3) % length;
				var prev1_index = (index - 1 + length) % length;
				var prev2_index = (index - 2 + length) % length;
				var prev3_index = (index - 3 + length) % length;
				children.eq(next1_index-1).addClass('next1');
				children.eq(next2_index-1).addClass('next2');
				children.eq(prev1_index-1).addClass('prev1');
				children.eq(prev2_index-1).addClass('prev2');
				if(length > 6){
					children.eq(next3_index-1).addClass('next3');
					children.eq(prev3_index-1).addClass('prev3');
				}
			}
		},
		
		voteOpener: function(){
			$('.xoxo_fn_votes').off().on('click',function(){
				var e = $(this);
				var b = e.find('.vote_info');
				if(e.hasClass('opened')){
					e.removeClass('opened');
					b.slideUp(300);
				}else{
					e.addClass('opened');
					b.slideDown(300);
				}
			});
			
			$('.xoxo_fn_vote_up').off().on('click',function(e){
				e.preventDefault();
				var element = $(this);
				if(element.closest('.xoxo_fn_votes').hasClass('up_action')){
					return false;
				}
				XoxoInit.vote(element,'up');
				return false;
			});
			
			
			$('.xoxo_fn_vote_down').off().on('click',function(e){
				e.preventDefault();
				var element = $(this);
				if(element.closest('.xoxo_fn_votes').hasClass('down_action')){
					return false;
				}
				XoxoInit.vote(element,'down');
				
				return false;
			});
		},
		
		vote: function(element,action){
			if(XoxoVoteWait === true) {return false;}
			var parent			= element.closest('.xoxo_fn_votes');
			parent.addClass('loading');
			XoxoVoteWait 		= true;
			var ID 				= parent.data('id');
			var requestData 	= {
				action: 'xoxo_fn_vote', 
				ID: ID,
				voteAction: action,
				security: XoxoAjax.nonce
			};
				
			$.ajax({
				type: 'POST',
				url: XoxoAjax.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data); //get the data object
					parent.find('.result_vote .count').text(fnQueriedObj.count__result);
					parent.find('.vote_info').html(fnQueriedObj.result__text);
					parent.removeClass('loading');
					parent.find('.result_vote .action').text(fnQueriedObj.difference);
					parent.removeClass('up_action down_action').addClass(action+'_action');
					XoxoVoteWait = false;
				},
				error: function(MLHttpRequest, textStatus, errorThrown) {
					console.log(MLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		},
		
		escapeHTML: function(string){
			return String(string).replace(/[&<>"'`=\/]/g, function (s) {
				return PoptioEntityMap[s];
			});
		},
		
		reaction: function(){
			$('.xoxo_fn_reaction_btn').off().on('click',function(){
				var element = $(this);
				if(XoxoReactionWait === true) {return false;}
				var parent			= element.closest('.xoxo_fn_reactions');
				parent.addClass('loading');
				XoxoReactionWait	= true;
				var ID 				= element.data('id');
				var requestData 	= {
					action: 'xoxo_fn_reactions', 
					ID: parseInt(ID),
					ajax_action: XoxoInit.escapeHTML(element.data('action')),
					security: XoxoAjax.nonce
				};
				

				$.ajax({
					type: 'POST',
					url: XoxoAjax.ajax_url,
					cache: false,
					data: requestData,
					success: function(data) {
						var fnQueriedObj 	= $.parseJSON(data); //get the data object
						var newReaction		= fnQueriedObj.reaction;
						var ajaxAction		= fnQueriedObj.ajax_action;
						element = $('.xoxo_fn_reaction_btn[data-id="'+ID+'"][data-action="'+newReaction+'"]');
						element.find('.count').html(fnQueriedObj.count);
						if(ajaxAction === 'add'){
							element.addClass('active');
						}else{
							element.removeClass('active');
						}
						XoxoReactionWait = false;
					},
					error: function(MLHttpRequest, textStatus, errorThrown) {
						console.log(MLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
				
				return false;
			});
				
		},
		
		readMore2: function(){
			$('.read_more.second a').each(function(){
				var e = $(this);
				var t = e.find('.text');
				var w = t.width();
				e.css('--www',(110+w)+'px');
			});
		},
		
		commentOpener: function(){
			var comment = $('.fn__comments');
			$('.xoxo_fn_comments .comment_opener a').off().on('click',function(){
				if(XoxoBody.hasClass('comment-active')){
					XoxoBody.removeClass('comment-active');
					comment.slideUp();
				}else{
					XoxoBody.addClass('comment-active');
					comment.slideDown();
				}
				return false;
			});
		},
		
		sidebarOpener: function(){
			var rightbar 	= $('.xoxo_fn_rightbar');
			var trigger		= $('.xoxo_fn_stickynav .right__trigger a,#xoxo_fn_header .right__trigger a');
			trigger.off().on('click',function(){
				if(trigger.hasClass('active')){
					trigger.removeClass('active');
					rightbar.removeClass('active');
				}else{
					trigger.addClass('active');
					rightbar.addClass('active');
				}
				return false;
			});
			$('.xoxo_fn_rightbar .bar_closer a,.xoxo_fn_rightbar .bar_extra_closer').off().on('click',function(){
				trigger.removeClass('active');
				rightbar.removeClass('active');
				return false;
			});
		},
		
		moreMenu: function(){
			$('.xoxo_fn_nav').each(function(){
				var nav = $(this);
				var menu = nav.find('.menu');
				var more = menu.find('.more');
				var moreBtn = more.find('a');
				var moreBtnWidth = moreBtn.width();
				var w = 0, a = 0,html = '',padding = 60;
				if(nav.parent().hasClass('bottom_fixer')){
					menu = $('.xoxo_fn_header .bottom_fixer');
					padding = 120;
				}
				nav.find('.xoxo_fn_main_nav > li').each(function(){
					var e = $(this);
					a+= parseInt(e.outerWidth(true));
					a+= moreBtnWidth;
					if(w+a>menu.width()-padding){
						e.addClass('disabled');
						html+='<li class="'+e.attr('class')+'">'+e.html()+'</li>';
					}else{
						e.removeClass('disabled');
					}
					a-= moreBtnWidth;
					w+= a;a=0;
				});
				if(html !== ''){
					more.addClass('active');
					more.find('.sub-menu').html(html);
				}else{
					more.removeClass('active');
				}
			});
				
			
		},
		
		reversedMenu: function(){
			$('.xoxo_fn_main_nav ul').each(function(){
				var e = $(this),
					w = e.offset().left + 240,
					W = $('body').width();
				if(w>W){
					e.addClass('reverse');
				}
			});
		},
		
		
		
		
		seachSomething: function(){
			var searchOpener 	= $('.xoxo_fn_header .search_opener a,.xoxo_fn_mobnav .mobsearch_opener, .icon_bar__search a');
			var searchbox 		= $('.xoxo_fn_searchbox');
			var input 			= searchbox.find('form input[type="text"]');
			var resultBox		= searchbox.find('.resultbox');
			var infoBox			= resultBox.find('.result_info');
			var resultList		= resultBox.find('.result_list ul');
			
			searchOpener.off().on('click',function(){
				if(XoxoBody.hasClass('search-active')){
					XoxoBody.removeClass('search-active');
				}else{
					XoxoBody.addClass('search-active');
					input.val('');
					setTimeout(function(){
						input[0].focus();
					},100);
				}
				return false;
			});
			
			searchbox.find('.search_closer').off().on('click',function(){
				XoxoBody.removeClass('search-active');
				resultList.html('');
				searchbox.removeClass('ajax_result');
				infoBox.html('<p>'+infoBox.data('info')+'</p>');
				return false;
			});
			input.on("keypress", function(event) {
				if (event.key === "Enter") {
					event.preventDefault();
					$('.xoxo_fn_searchbox form input[type="submit"]').trigger('click');
				}
			});
			
			// filter search
			var timeout = null;
			input.on('keyup', function(){
				var field 	= $(this);
				var text 	= field.val();
				
				clearTimeout(timeout);

				timeout = setTimeout(function () {
					XoxoSearch.search = text;
					if(text === XoxoSearch.text){
							return false;
					}
					XoxoSearch.text	= text;
					
				}, 700);
			});
			
			
		},
			
		
		totopScroll: function(){
			var minSpeed 		= 500;
			var maxSpeed		= 1500;
			$(".xoxo_fn_totop").off().on('click', function(e) {
				e.preventDefault();
				var speed		= ($(window).scrollTop()-$(window).height())/2;
				if(speed < minSpeed){speed = minSpeed;}
				if(speed > maxSpeed){speed = maxSpeed;}
				$("html, body").animate({ scrollTop: 0 }, speed);
				return false;
			});
		},
		
		ready: function(){
			$('.xoxo_fn_walletbox, .xoxo_fn_wallet_closer, .xoxo_fn_leftnav, .xoxo_fn_leftnav_closer').removeClass('ready');
		},
		
		countdown: function(){
			$('.xoxo_fn_countdown').each(function(){
				var e = $(this),
					t = e.data('type');
				if(t === 'due_date'){
					var countDownDate = new Date(e.data('date')).getTime();
				}else if(t === 'ever'){
					var days 	= parseInt(e.data('days')) * 24 * 3600,
						hours	= parseInt(e.data('hours')) * 3600,
						minutes	= parseInt(e.data('minutes')) * 60,
						seconds	= parseInt(e.data('seconds'));
					var ever	= days + hours + minutes + seconds;
				}
				if(e.hasClass('boxed')){
					e.after('<div class="xoxo_fn_boxed_countdown"><span class="left_wing"></span><span class="right_wing"></span><ul><li class="days"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-days')+'</span></div></li><li class="hours"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-hours')+'</span></div></li><li class="minutes"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-minutes')+'</span></div></li><li class="seconds"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-seconds')+'</span></div></li></ul></div>');
					var p = e.parent().find('.xoxo_fn_boxed_countdown');
					e.remove();
				}
				if(t === 'due_date'){
					// Update the count down every 1 second
					var x = setInterval(function() {
						// Get today's date and time
						var now = new Date().getTime();

						// Find the distance between now and the count down date
						var distance = countDownDate - now;

						// Time calculations for days, hours, minutes and seconds
						var days = Math.floor(distance / (1000 * 60 * 60 * 24));
						var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
						var seconds = Math.floor((distance % (1000 * 60)) / 1000);

						if(e.hasClass('boxed')){
							days = (days < 10 ? '0' + days : days);
							hours = (hours < 10 ? '0' + hours : hours);
							minutes = (minutes < 10 ? '0' + minutes : minutes);
							seconds = (seconds < 10 ? '0' + seconds : seconds);
							p.find('.days h3').text(days);
							p.find('.hours h3').text(hours);
							p.find('.minutes h3').text(minutes);
							p.find('.seconds h3').text(seconds);
						}else{
							var text = '';
							if(days > 0){text += days + 'd: ';}
							text += hours + 'h: ' + minutes + 'm: ' + seconds + 's';
							e.text(text);
						}
						if (distance < 0) {
							if(e.hasClass('boxed')){
								p.find('.days h3').text(0);
								p.find('.hours h3').text(0);
								p.find('.minutes h3').text(0);
								p.find('.seconds h3').text(0);
							}else{
								e.text('0d: 0h: 0m: 0s');
							}
							clearInterval(x);
					  	}
					}, 1000);
				}else if(t === 'ever'){
					setInterval(function(){
						days 	= Math.floor(ever / 86400);
						hours	= Math.floor((ever % 86400) / 3600);
						minutes	= Math.floor((ever % 3600) / 60);
						seconds	= Math.floor((ever % 60));
							
						if(e.hasClass('boxed')){
							days = (days < 10 ? '0' + days : days);
							hours = (hours < 10 ? '0' + hours : hours);
							minutes = (minutes < 10 ? '0' + minutes : minutes);
							seconds = (seconds < 10 ? '0' + seconds : seconds);
							p.find('.days h3').text(days);
							p.find('.hours h3').text(hours);
							p.find('.minutes h3').text(minutes);
							p.find('.seconds h3').text(seconds);
						}else{
							var text = '';
							if(days > 0){text += days + 'd: ';}
							text += hours + 'h: ' + minutes + 'm: ' + seconds + 's';
							e.text(text);
						}
						ever--;
					}, 1000);
				}
			});
		},
		
		minHeightPages: function(){
			var adminBar 		= $('#wpadminbar');
			var adminBarHeight 	= 0;
			var footer 			= $('#xoxo_fn_footer');
			var header 			= $('#xoxo_fn_header');
			var footerHeight	= 0;
			var headerHeight	= 0;
			if(adminBar.length){
				adminBarHeight = adminBar.height();
			}
			if (window.matchMedia('(max-width: 600px)').matches) {
				adminBarHeight = 0;
			}
			if(header.length){
				headerHeight = header.outerHeight();
			}
			if(footer.length){
				footerHeight = footer.outerHeight();
			}
			$('.xoxo_fn_page_ajax').css({minHeight: ($(window).height() - adminBarHeight - footerHeight - headerHeight) + 'px'});
		},
		
		fixAdminBar: function(){
			if(XoxoBody.hasClass('admin-bar')){
				$('html').addClass('frenify-html');
			}
			if($('.xoxo_fn_author_info .info_img img').length){
				$('.xoxo_fn_author_info .info_in').css({marginTop: 0});
			}
		},
		
		
		preloader: function(){
			$('.xoxo_fn_preloader').addClass('ready');
		},
		
		
		widgetTitle: function(){
			$('.wp-block-group__inner-container > h1,.wp-block-group__inner-container > h2,.wp-block-group__inner-container > h3,.wp-block-group__inner-container > h4,.wp-block-group__inner-container > h5,.wp-block-group__inner-container > h6').each(function(){
				var e = $(this);
				e.after('<div class="wid-title"><span class="text">'+e.text()+'</span><span class="icon"></span></div>');
				e.remove();
			});
		},
		
		
		totopWinScroll: function (){
			var WinOffset	= $(window).scrollTop();
			var totop		= $('a.xoxo_fn_totop');
			var scrollPercent = 100 * WinOffset / ($(document).height() - $(window).height());
			totop.find('.progress').css({height: scrollPercent + '%'});
			if(totop.length){
				if(WinOffset > 300){
					totop.addClass('active');
				}else{
					totop.removeClass('active');
				}
			}
		},
		
		
		
		// ************************************************************************
		// ************************************************************************
		// ************************************************************************
		blog_info: function(){
			if($('.blog_info').height() === 0){
				$('.xoxo_fn_comment').addClass('margin-no-top');
			}
			if($('.wp-calendar-nav').length){
				$('.wp-calendar-nav').each(function(){
					var e = $(this);
					if(!e.find('a').length){
						e.remove();
					}
				});
			}
		},
		
		projectPopup: function(){
			$('.xoxo_popup_gallery').each(function() { // the containers for all your galleries
				$(this).magnificPopup({
					delegate: 'a.zoom', // the selector for gallery item
					type: 'image',
					gallery: {
					  enabled:true
					},
					removalDelay: 300,
					mainClass: 'mfp-fade'
				});

			});
			$('.xoxo_popup_youtube, .xoxo_popup_vimeo').each(function() { // the containers for all your galleries
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-fade',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false
				});
			});

			$('.xoxo_popup_soundcloude').each(function(){
				$(this).magnificPopup({
					type : 'image',
					gallery: {
						enabled: true, 
					},
				});	
			});
		},
		
		
		
		inputCheckBoxInComment: function(){
			if($('p.comment-form-cookies-consent input[type=checkbox]').length){
				$('p.comment-form-cookies-consent input[type=checkbox]').wrap('<label class="fn_checkbox"></label>').after('<span></span>');
			}
		},
		
		portfolioContentHeight: function(){
			var portfolio = $('.xoxo_fn_portfolio_page .portfolio_content');
			if(portfolio.height() === 0){
				portfolio.css({display: 'none'});
			}
		},
		
		url_fixer: function(){
			$('a[href*="fn_ex_link"]').each(function(){
				var oldUrl 	= $(this).attr('href'),
					array   = oldUrl.split('fn_ex_link/'),
					newUrl  = XoxoAjax.siteurl + "/" + array[1];
				$(this).attr('href', newUrl);
			});
			if($('.xoxo-fn-protected').length){
				$('.xoxo_fn_pagein').css({paddingTop: 0});
			}
		},
		
		cursor: function () {
			var myCursor = $('.frenify-cursor');
			if (myCursor.length) {
				if ($("body").length) {
					const e = document.querySelector(".cursor-inner"),
						t 	= document.querySelector(".cursor-outer");
					var n, i = 0,W = 0,intro = 0,
						o = !1;
					if($('.xoxo_fn_intro').length){intro=1;}
					
					var buttons = ".fn__blog_anchor .ba_item,.modal_ux_closer, .xoxo_fn_nav .trigger,.xoxo_fn_header .trigger,.fn_cs_intro_testimonials .prev, .fn_cs_intro_testimonials .next, .fn_cs_swiper_nav_next, .fn_cs_swiper_nav_prev, .fn_dots, .swiper-button-prev, .swiper-button-next, .fn_cs_accordion .acc_head, .xoxo_fn_popupshare .share_closer, .xoxo_fn_header .fn_finder, .xoxo_fn_header .fn_trigger, a, input[type='submit'], .cursor-link, button";
					var sliders = ".owl-carousel, .swiper-container, .cursor-link";
					// link mouse enter + move
					window.onmousemove = function(s) {
						o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
					}, $("body").on("mouseenter", buttons, function() {
						e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
					}), $("body").on("mouseleave", buttons, function() {
						$(this).is("a") && $(this).closest(".cursor-link").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
					}), e.style.visibility = "visible", t.style.visibility = "visible";
					
					
					// slider mouse enter
					XoxoBody.on('mouseenter', sliders, function(){
						e.classList.add('cursor-slider');
						t.classList.add('cursor-slider');
					}).on('mouseleave', sliders,function(){
						e.classList.remove('cursor-slider');
						t.classList.remove('cursor-slider');
					});
					
					// slider mouse hold
					XoxoBody.on('mousedown', sliders, function(){
						e.classList.add('mouse-down');
						t.classList.add('mouse-down');
					}).on('mouseup', sliders, function(){
						e.classList.remove('mouse-down');
						t.classList.remove('mouse-down');
					});
				}
			}
		},
		
		widget__archives: function(){
			$('.widget_archive li').each(function(){
				var e = $(this);
				var a = e.find('a').clone();
				XoxoBody.append('<div class="frenify_hidden_item"></div>');
				$('.frenify_hidden_item').html(e.html());
				$('.frenify_hidden_item').find('a').remove();
				var suffix = $('.frenify_hidden_item').html().match(/\d+/); // 123456
				$('.frenify_hidden_item').remove();
				suffix = parseInt(suffix);
				if(isNaN(suffix)){
					return false;
				}
				suffix = '<span class="count">'+suffix+'</span>';
				e.html(a);
				e.append(suffix);
			});
		},
		
		prev_next_posts: function(){
			if($('.xoxo_fn_siblings')){
				$(document).keyup(function(e) {
					if(e.key.toLowerCase() === 'p') {
						var a = $('.xoxo_fn_siblings').find('a.previous_project_link');
						if(a.length){
							window.location.href = a.attr('href');
							return false;
						}
					}
					if(e.key.toLowerCase() === 'n') {
						var b = $('.xoxo_fn_siblings').find('a.next_project_link');
						if(b.length){
							window.location.href = b.attr('href');
							return false;
						}
					}
				});
			}
		},
		
		
		
		
		widget__pages: function(){
			var nav 						= $('.widget_pages ul');
			nav.each(function(){
				$(this).find('a').off().on('click', function(e){
					var element 			= $(this);
					var parentItem			= element.parent('li');
					var parentItems			= element.parents('li');
					var parentUls			= parentItem.parents('ul.children');
					var subMenu				= element.next();
					var allSubMenusParents 	= nav.find('li');

					allSubMenusParents.removeClass('opened');

					if(subMenu.length){
						e.preventDefault();

						if(!(subMenu.parent('li').hasClass('active'))){
							if(!(parentItems.hasClass('opened'))){parentItems.addClass('opened');}

							allSubMenusParents.each(function(){
								var el = $(this);
								if(!el.hasClass('opened')){el.find('ul.children').slideUp();}
							});

							allSubMenusParents.removeClass('active');
							parentUls.parent('li').addClass('active');
							subMenu.parent('li').addClass('active');
							subMenu.slideDown();


						}else{
							subMenu.parent('li').removeClass('active');
							subMenu.slideUp();
						}
						return false;
					}
				});
			});
		},
		
		submenu__Mobile: function(){
			var nav 						= $('ul.vert_menu_list, .widget_nav_menu ul.menu, .xoxo_fn_mobnav .mob_bot .mobile_menu');
			var mobileAutoCollapse			= XoxoWrapper.data('mobile-autocollapse');
			nav.each(function(){
				$(this).find('a').off().on('click', function(e){
					var element 			= $(this);
					var parentItem			= element.parent('li');
					var parentItems			= element.parents('li');
					var parentUls			= parentItem.parents('ul.sub-menu');
					var subMenu				= element.next();
					var allSubMenusParents 	= nav.find('li');

					allSubMenusParents.removeClass('opened');

					if(subMenu.length){
						e.preventDefault();

						if(!(subMenu.parent('li').hasClass('active'))){
							if(!(parentItems.hasClass('opened'))){parentItems.addClass('opened');}

							allSubMenusParents.each(function(){
								var el = $(this);
								if(!el.hasClass('opened')){el.find('ul.sub-menu').slideUp();}
							});

							allSubMenusParents.removeClass('active');
							parentUls.parent('li').addClass('active');
							subMenu.parent('li').addClass('active');
							subMenu.slideDown();


						}else{
							subMenu.parent('li').removeClass('active');
							subMenu.slideUp();
						}
						return false;
					}
					if(mobileAutoCollapse === 'enable'){
						if(nav.parent().parent().hasClass('opened')){
							nav.parent().parent().removeClass('opened').slideUp();
							$('.xoxo_fn_mobilemenu_wrap .hamburger').removeClass('is-active');
						}
					}
				});
			});
		},
		
		hamburgerOpener__Mobile: function(){
			var hamburger		= $('.xoxo_fn_mobilemenu_wrap .hamburger');
			hamburger.off().on('click',function(){
				var element 	= $(this);
				var menupart	= $('.xoxo_fn_mobilemenu_wrap .mobilemenu');
				if(element.hasClass('is-active')){
					element.removeClass('is-active');
					menupart.removeClass('opened');
					menupart.slideUp(500);
				}else{
					element.addClass('is-active');
					menupart.addClass('opened');
					menupart.slideDown(500);
				}return false;
			});
		},
		
		
		
		imgToSVG: function(){
			$('img.fn__svg').each(function(){
				var img 		= $(this);
				var imgClass	= img.attr('class');
				var imgURL		= img.attr('src');

				$.get(imgURL, function(data) {
					var svg 	= $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						svg 	= svg.attr('class', imgClass+' replaced-svg');
					}
					img.replaceWith(svg);

				}, 'xml');
			});	
		},
		
		
		dataFnStyle: function(){
			$('[data-fn-style]').each(function(){
				var el		= $(this);
				var s 		= el.attr('data-fn-style');
				$.each(s.split(';'),function(i,e){
					el.css(e.split(':')[0],e.split(':')[1]);
				});
			});
		},
		
		dataFnBgImg: function(){
			var bgImage 	= $('*[data-fn-bg-img]');
			bgImage.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-fn-bg-img');
				var bgImg	= element.data('fn-bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					if(bgImg === ''){
						return;
					}
					element.css({backgroundImage:'url('+bgImg+')'});
				}
			});
			var bgImage2 	= $('*[data-bg-img]');
			bgImage2.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-bg-img');
				var bgImg	= element.data('bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					if(bgImg === ''){
						return;
					}
					element.css({backgroundImage:'url('+bgImg+')'});
				}
			});
		},
		
		isotopeMasonry: function(){
			var masonry = $('.fn__masonry');
			if($().isotope){
				masonry.each(function(){
					$(this).isotope({
						itemSelector: '.mas__in',
						masonry: {}
					});
				});
			}
			var masonry2 = $('.blog_layout_masonry > ul');
			if($().isotope){
				masonry2.each(function(){
					$(this).isotope({
						itemSelector: '.post_item',
						masonry: {}
					});
				});
			}
		},
    };
	
	
	
	// ready functions
	$(document).ready(function(){
		XoxoInit.init();
	});
	
	// resize functions
	$(window).on('resize',function(e){
		e.preventDefault();
		XoxoInit.isotopeMasonry();
		XoxoInit.minHeightPages();
		XoxoInit.moreMenu();
		XoxoInit.quickNavResize();
		XoxoInit.single_post__gallery();
		XoxoInit.blogPageFeatured();
	});
	
	// scroll functions
	$(window).on('scroll', function(e) {
		e.preventDefault();
		XoxoInit.totopWinScroll();
		XoxoInit.stickyHeader();
    });
	
	// load functions
	$(window).on('load', function(e) {
		e.preventDefault();
		XoxoInit.preloader();
		XoxoInit.shareWordHeight();
		XoxoInit.isotopeMasonry();
		setTimeout(function(){
			XoxoInit.isotopeMasonry();
			XoxoInit.single_post__gallery();
		},200);
	});
	
	
	window.addEventListener("load", function(){
		XoxoInit.preloader();
		XoxoInit.moreMenu();
	});
	
	
	$( window ).on( 'elementor/frontend/init', XoxoInit.rippleEffect );
	
})(jQuery);