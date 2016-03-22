

function displayStatuses() {
	$.getJSON( "/getNewerStatuses" )
		.done (function(json) {
			data = json;
			$("statuses").html(formatStatuses(data.statuses));
		});
}

function displayNewerStatuses() {
	if (typeof data === 'undefined') {
		displayStatuses();
	} else {
		var since_id = data.since_id;
		$.getJSON( "/getNewerStatuses", { since_id: since_id } )
			.done (function(json) {
				if (since_id != 0) {
					data.statuses = json.statuses + data.statuses;
					data.since_id = json.since_id;
					$("#statuses").html(formatStatuses(data.statuses));
				}
			});
	}
}

function displayOlderStatuses() {
	if (typeof data === 'undefined') {
		displayStatuses();
	} else {
		var max_id = data.max_id;
		$.getJSON( "/getOlderStatuses", { max_id: max_id } )
			.done (function(json) {
				data.max_id = json.max_id;
				data.statuses = data.statuses.concat(json.statuses);
				$("#statuses").append(formatStatuses(json.statuses));
			});
	}
}

// function postStatus(status) {
// 	$.getJSON( "/postStatus", { $.param(status) })
// 		.done (function() {
// 			displayNewerStatuses();
// 		});
// }



function formatStatuses(statuses) {
	var formattedStatuses = "";
	for (status in statuses) {
		formattedStatuses+=formatStatus(statuses[status]);
	}
	return formattedStatuses;
}

function formatStatus(status) {
	var formattedStatus = "";
	formattedStatus+=
		'<div class="container-fluid" id='+status.id+'>'+
			'<div class="row">'+
				'<div class="header-img col-xs-3 col-sm-2 col-md-1">'+
					'<img src='+status.user.profile_image_url+' class="avatar img-circle"/>'+
				'</div>'+
				'<div class="header-text col-xs-7 col-sm-9 col-md-10">'+
					'<b>'+status.user.screen_name+'</b>'+
					'<br>'+
					'<small id="date">'+formatDate(status.created_at)+'</small>'+
				'</div>'+
				'<div class="col-xs-1 col-sm-1 col-md-1">'+
					'<img src="../static/images/logo-weibo.jpeg" class="header-logo"/>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="content col-xs-12 text-justify">'+
					status.text+
				'</div>'+
			'</div>'+
			'<pic/>'+
			'<retweet/>'+
			'<div class ="row footer">'+
				'<div class="btn-group btn-group-justified">'+
					'<div class="btn-group">'+
						'<button type="button" class="btn btn-link">'+
							'<i class="fa fa-share-square-o"></i>'+
							'<span> </span>'+status.reposts_count+
						'</button>'+
					'</div>'+
					'<div class="btn-group">'+
						'<button type="button" class="btn btn-link">'+
							'<i class="fa fa-comments-o"></i>'+
							'<span> </span>'+status.comments_count+
						'</button>'+
					'</div>'+
					'<div class="btn-group">'+
						'<button type="button" class="btn btn-link">'+
							'<i class="fa fa-thumbs-o-up"></i>'+
						'</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>';

	
	if (status.pic_urls) {
		formattedStatus = formattedStatus.replace('<pic/>',
			'<div class=row>'+
			formatPicture(status.pic_urls)+
			'</div>');
	}
	

	if (status.retweeted_status) {
		formattedStatus = formattedStatus.replace('<retweet/>',
				'<div class="row retweet">'+
					'<div class="col-xs-12">'+
						'@'+status.retweeted_status.user.screen_name +': '+
				 			status.retweeted_status.text +
					'</div>'+
				'</div>'+
				'<retweet-pic/>'
		);	
		
		if (status.retweeted_status.pic_urls) {
			formattedStatus = formattedStatus.replace('<retweet-pic/>',
				'<div class="row retweet">'+
				formatPicture(status.retweeted_status.pic_urls)+
				'</div>');
		}
	}
	return formattedStatus;
}



function formatDate(dateString) {
	var curDate = new Date();
	var statusDate = new Date(dateString);
	var elapsedSecond = (curDate.getTime()-statusDate.getTime()) / 1000;
	if (elapsedSecond < 60) {
		return (elapsedSecond>>0) + '秒前';
	} else if (elapsedSecond < 3600) {
		return ((elapsedSecond/60)>>0) + '分钟前';
	} else if (elapsedSecond > 3600 && elapsedSecond < 3600*3) {
		return ((elapsedSecond/60/60)>>0) + '小时前';
	} else if (curDate.getDate() == statusDate.getDate()) {
		return '今天 ' + statusDate.getHours() + ":" + statusDate.getMinutes();
	} else if (curDate.getDate() == statusDate.getDate()+1) {
		return '昨天 ' + statusDate.getHours() + ":" + statusDate.getMinutes();
	} else if (curDate.getDate() == statusDate.getDate()+2) {
		return '前天 ' + statusDate.getHours() + ":" + statusDate.getMinutes();
	} else {
		return statusDate.getMonth() + '-' + statusDate.getDate() + " " + statusDate.getHours() + ":" + statusDate.getMinutes();
	}
}

function formatPicture(pictures) {
	var HTMLPictures = '';
	for (var pic in pictures) {
		HTMLPictures+=
			'<div class="col-xs-4">'+
				'<img src='+pictures[pic].thumbnail_pic+' class="status-img center-block"/>'+
			'</div>';
	}
	return HTMLPictures;
}


		
			
				
			
			
				
				
				
			
		
		

