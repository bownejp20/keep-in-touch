jQuery(document).ready(function() {
	'use strict';
	jQuery(document).on('click', '.fn_widget_add_button', function(evt){
		
		evt.preventDefault();
		var element 	= jQuery(this);
		var preview 	= element.siblings('img');
		var hiddenType 	= element.siblings('input[type="hidden"]');
		
		var custom_uploader = wp.media({
			multiple: false  // Set this to true to allow multiple files to be selected
		})
		.on('select', function() {
			var attachment = custom_uploader.state().get('selection').first().toJSON();
			preview.attr('src', attachment.url);
			hiddenType.val(attachment.url);
		})
		.open();
	});
	
	
	
	jQuery('#frenify-postoption input[type="checkbox"]').each(function(){
		var element = jQuery(this),
			name	= element.attr('name');
		element.wrap('<label class="frenify_checkbox" for="'+name+'" />');
		element.parent().append('<span class="slider"></span>');
	});
	jQuery(window).load(function(){
		setTimeout(function(){
			xoxo_fn_post_format_change_for_admin_js();	
		},100);
	});
});

function xoxo_fn_post_format_change_for_admin_js(){
	"use strict";
	var select = jQuery('.edit-post-post-format select');
	select.on('change', function(){
		var chosed 				= jQuery(this).children('option:selected').val();
		var allFooterSwitchers 	= jQuery('#frenify-meta-post-video,#frenify-meta-post-audio,#frenify-meta-post-gallery,#frenify-meta-post-link,#frenify-meta-post-quote,#frenify-meta-post-image,#frenify-meta-post-status');
		allFooterSwitchers.slideUp();
		jQuery('#frenify-meta-post-'+chosed).slideDown();
	});
	select.triggerHandler("change");
}