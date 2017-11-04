/*Copyright (c) 2017 lubimki.ru HQ audio software, RCeFramework

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Redestribution of source code must retain the above copyright notice:

Created by lubimki.ru HQ audio software 2001-2017 with association with RCeFramework

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var p;
var flag=1;
var ind=1;
var stid=0;
var g_volume=0.89;
var vid;
var checkPlaying;
var YaShareInstance;
var qual="128";
var status='none';

$.ajaxSetup({async:true});
function loading(id){
	if(!$('.station#'+id).hasClass('loading')){
		$('.station#'+id).addClass('loading');
	}
	if($('.station#'+id).hasClass('playing')){
		$('.station#'+id).removeClass('playing');
	}
}
function playing(id){
	if($('.station#'+id).hasClass('loading')){
		$('.station#'+id).removeClass('loading');
	}
	if(!$('.station#'+id).hasClass('playing')){
		$('.station#'+id).addClass('playing');
	}
	if(id!=stid){
		if($('.station#'+stid).hasClass('playing')){
			$('.station#'+stid).removeClass('playing');
		}
	}
}
function pause(id){
	if(typeof vid!=='undefined'){
		if(!vid.paused){
			vid.pause();
			vid='';
		}
	}
//	$('.station').removeClass('playing');
	if($('.station#'+id).hasClass('loading')){
		$('.station#'+id).removeClass('loading');
	}
	if($('.station#'+id).hasClass('playing')){
		$('.station#'+id).removeClass('playing');
	}
}
function play(id){
	if($('.station').hasClass('loading')){
		$('.station').removeClass('loading');
		vid.pause();
	}
	if($('.station').hasClass('playing')){
		$('.station').removeClass('playing');
		vid.pause();
	}
	vid = document.getElementById("p"+id);
		vid.load();
		loading(id);
		vid.volume=g_volume;
		vid.oncanplaythrough  = function() {
			vid.play();
			playing(id);
//			clearTimeout(checkPlaying);
		};
		vid.onplaying() = function(){
//			alert('play');
		};
		vid.onpause() = function(){
			vid.play();
			pause(id);
		};
		vid.onwaiting = function() {
			alert("Wait! I need to buffer the next frame");
		};
		vid.onabort = function() {
			alert("Video load aborted");
		};
		vid.onerror = function() {
			alert("Error! Something went wrong");
		};
		vid.onstalled = function() {
			alert("Media data is not available");
		};
		vid.onsuspend = function() {
			alert("Loading of the media is suspended");
		};
}

function setVolume(newVal){
	g_volume=newVal;
//	alert(g_volume);
	vid.volume = g_volume;
	writeCookie("radiomaker_volume", g_volume, d1 );
}
function playerStatus(){
//	console.log(vid.readyState);
//	console.log(vid.ended);
	radiocreatorP(stid,true);
	checkPlaying=setTimeout(playerStatus,2000);
}
function playerStatusI(){
	radiocreatorI(stid,true);
	//checkPlaying=setTimeout(playerStatusI,2000);
}
function radiocreatorI(id,error,qual){
	if(typeof vid==='undefined'){
	//	alert('new');
		play(id);
		
	}else if(vid.paused){
//		alert('paused');
//		pause(id,stid);
	//	alert('paused');
		play(id);
	}else if(!$('.station#'+id).hasClass('playing')){
		
	//	alert('delete');
		if(id!=stid){
			//alert('playing');
			pause(id,stid);
		}
		play(id);
	}else{
		pause(id);
//		alert('pause');
	}
	vid.volume = g_volume;
/*	vid.onstalled = function() {
	//	alert('stal');
		playerStatusI();
	};
	vid.onsuspend = function() {
	//	alert('suspend');
	};*/
	stid=id;
}

function radiocreatorP(id,error,qual,link){
	console.log('log:'+status);
	if(stid==id){
		if($('.station#'+id).hasClass('playing')){
			$('.station#'+id).removeClass('playing');
			if(status!='stalled'){
				status="pause";
				console.log('log:'+status);
				vid.pause();
				return false;
			}
		}
	}
	$('.station#'+stid).removeClass('playing');
	var browser = navigator.userAgent.toLowerCase();
	var isAndroid = browser.indexOf("android") > -1;
	
	
	vid.volume = g_volume;
	vid.onstalled = function() {
		status="stalled";
		console.log('ev:'+status);
	};
	
	vid.oncanplaythrough = function() {
		status="playing";
		console.log('ev:'+status)
		clearTimeout(checkPlaying);
		vid.play();
		$('.station#'+id).removeClass('loading');
		if($('.station#'+id).hasClass('playing')){
		}else{
			$('.station#'+id).addClass('playing');
		}
	};
	vid.onpause = function() {
		status="stopped";
		console.log('ev:'+status);
		if($('.station#'+id).hasClass('playing')){
			status="playing interrupts";
			console.log('ev:'+status);
			$('.station#'+id).addClass('loading');
			stid=id;
			playerStatus();
		}
		$('.station').removeClass('playing');
/*		if($('.station#'+id).hasClass('loading')){
			status="disabling by user wheel";
			console.log('ev:'+status);
			$('.station').removeClass('loading');
			clearTimeout(checkPlaying);
		}*/
	};

	vid.onsuspend = function() {
		status="suspend";
		console.log('ev:'+status);
	};
	vid.onerror = function() {
		
		if($('.station#'+id).hasClass('loading')){
			console.log('ev:'+status);
			stid=id;
			if(status!="error" && status!="pause")
				{
				playerStatus();
				}
		}
		status="error";
		console.log('ev:'+status);
	}
	if(typeof link==='undefined'){
	}else{
		p=link;
	}
	
	if(typeof qual==='undefined'){
			var qual="128";
	}
	vid.src = p.replace('128',qual);

	vid.load();
	if(!$('.station#'+id).is('.loading'))
		{
		$('.station#'+id).addClass('loading');
		}
	/*if(isAndroid) {
		if(!$('.station#'+id).is('.playing')){
			$('.station#'+id).addClass('playing');
		}else{
			vid.pause();
			vid='';
			$('.station#'+id).removeClass('playing');
		}
	}else{*/
		vid.onplay = function() {
			status="play";
			console.log('ev:'+status);
			if(typeof error === 'undefined' || !error){
			//alert(id);
				if(!$('.station#'+id).is('.playing')){
					$('.station#'+id).addClass('playing');
				}else{
				//	vid.pause();
				//	$('.station#'+id).removeClass('playing');
				}
			}
		};
	//}
	stid=id;
}	

function minimizeHeight(element){
	var obj=element.closest('.while-loading .load-head');
	if(element.is('.slide-down')){
		obj.css('height','10px');
		writeCookie('collapse-footer','collapse');
		element.text('Р Р°Р·РІРµСЂРЅСѓС‚СЊ')
	}else{
		obj.css('height','254px');
		writeCookie('collapse-footer','expand');
		element.text('РЎРІРµСЂРЅСѓС‚СЊ');
	}
	element.toggleClass('slide-down','slide-up');
}
function clearCommentForm(form){
	form.find('textarea').val("");
}
function updateComments(){
	if(location.pathname.indexOf('/station/view/index')==-1){
		var url='/station/comment/show';
	}else{
		var url=location.pathname.replace('/station/view/index','');
	}
	
	if(url.length<10){
		url='/station/comment/show';
	}
}

function updateCommentsCol(data){
	$('.l-comments #comments-list').html(data);
}
function Like(song_id,id){
	$.ajax({ type: "POST",  url: "/station/view/like", data: {"id":id}, 
			success:function( msg ){ 
					//$('#'+id).closest('.station').find('.like').html(msg);
					if($('#Comment_model_id').val($('.station.playing').attr('id'))){
						$('#Comment_model_id').val($('.station.playing').attr('id'));
						$('#Comment_current_track_name').val($('.station.playing #songName0 p').text());
						$('#Comment_current_track').val($('.station.playing div#songId0').text());
						$('#Comment_comment').val('РњРЅРµ РЅСЂР°РІРёС‚СЃСЏ: '+$('.station.playing #songName0 p').text()+' РЅР° СЃС‚Р°РЅС†РёРё: '+$('.station.playing h1').text());
						$('#comment-form-front-left').ajaxSubmit({
		        				target: '.l-comments',
							clearForm:true,
							success: function(){
							}
        					});
					}
			},
			error: function () {
        			alert("error");
    			}
				});
	$.ajax({ type: "POST",  url: "/station/view/likeSong", data: {"id":id,'song_id':song_id}, 
			success:function( msg ){ 
				$('#'+id).closest('.station').find(' .song-like-up p').html(msg);
			},
			error: function () {
        			alert("error");
    			}
		});
}

function unLike(song_id,id){
		$.ajax({ type: "POST",  url: "/station/view/unLike", data: {"id":id}, 
			success:function( msg ){ 
					if($('#Comment_model_id').val($('.sm2_playing').attr('id'))){
					}
			},
			error: function () {
        			alert("error");
    			}
				});
	$.ajax({ type: "POST",  url: "/station/view/unLikeSong", data: {"id":id,'song_id':song_id}, 
			success:function( msg ){ 
				$('#'+id).closest('.station').find('.song-like-down p').html(msg);
			},
			error: function () {
        			alert("error");
    			}
		});
}
function submitComment(obj){
	var form=obj.closest('form');
	$('.head-station-name').val($('.station.playing h1').text());
	$('#Comment_model_id').val($('.station.playing').attr('id'));
	$('#Comment_current_track_name').val($('.station.playing #songName0 p').text());
	$('#Comment_current_track').val($('.station.playing div#songId0').text());
	$.ajax({ type: "POST",  url: '/station/comment/show', data:form.serialize(), 
		beforeSend:function(){
			clearCommentForm(form);
		},
		success:function(data){
			updateCommentsCol(data);
		},
		error: function () {
		alert("error");
		}
	});
}
$(document).on('click','.button-128,.button-256',function()
	{
	
	if($(this).is('.selected')){
		}else{
			qual=$(this).attr('class').substr(7);
			if(qual==128){var k=256;}else{var k=128;}
			writeCookie("radiomaker_quality", qual, d1 );
			$(this).closest('li').find('.station').removeClass('hidden');
			$(this).closest('li').find('.q-'+k).addClass('hidden');
			$(this).closest('li').find('.selected').removeClass('selected');
			$(this).addClass('selected');
		}
		
	}
);
$(document).on('input','.main-volume',function()
	{
	g_volume=$(this).val();
	$('.main-volume').val(g_volume);
	writeCookie("radiomaker_volume", g_volume, d1 );
	if(typeof vid!=='undefined')
		{
		vid.volume=g_volume;
		}
	}
);

$(document).ready(function(){
	vid = document.getElementById("radiocreatorP");
	//vid = document.getElementById("radiocreatorP");
	if(getCookie("radiomaker_quality")){
		var qual=getCookie("radiomaker_quality");
		if(qual==128){var k=256;}else{var k=128;}
		$('.button-128,.button-256').removeClass('selected');
		$('.button-'+qual).addClass('selected');
		$('.q-'+k).addClass('hidden');
		$('.q-'+qual).removeClass('hidden');
	}
	
	if(!getCookie("radiomaker_volume")){
		$('.main-volume').val(g_volume);
		
	}else{
		g_volume=getCookie("radiomaker_volume");
		if(g_volume>1){
			g_volume=g_volume/100;
		}
		$('.main-volume').val(g_volume);
	}

	



	var intTime = new Date().getTime();
	var getTime = function() {
    	    var intNow = new Date().getTime();
    	    if (intNow - intTime > 1000) {
			console.log(status);
			var broadcast_id=15;
			$.ajax({'url':'/broadcast_message.php?id='+broadcast_id,
				complete:function(data){
					$('.dj_message').text(data.responseText);
				}
			});
			if(typeof vid!=='undefined'){
				
				console.log(vid.networkState);
			}
			console.log("I'M AWAKING UP");
    	    }
	    updateComments();
	    
    	    intTime = intNow;
    	    setTimeout(getTime,20000);
	};
	getTime();
//	setInterval(function(){},10000);
});

window.onload=function(){
	$('.overlay').fadeOut('1500');
	$('.pagewrap').addClass('loaded');
}
