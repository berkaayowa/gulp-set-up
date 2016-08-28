$app = {
	initAdmin:function(){},
	initHome:function(){},
	initNoAdmin:function(){},
	initOverlayOptions:function(){}
};

$appFunctionalities = {
	loadChat:function(){},
	comment:function(){},
	loadNewTasks:function(){},
	loadUnderReviewTasks:function(){},
	loadDoneTasks:function(){},
	loadTasksDescription:function(){},
	buttonsPressed:function(){},
	loadNews:function(){},
	loading:function(){},
	login:function(){},
	clicks:function(){}
};

$appErrorDisplay = {
	feedback:function(){},
	initHome:function(){},
	initNoAdmin:function(){},
	initOverlayOptions:function(){}
};
/*
global variables
*/
var timeToRefreshTasks = 3000;
var timeToRefreshComments = 5000;
var loader = 0;
//var user_id = $('[data-user-id]').data('user-id'); 


$app.initOverlayOptions = function() {
	$("[data-open-description]").click(function(){
		$("[data-show]").show('slow');
		$('body').css('overflow-x','hidden');
	});

	$("[data-close]").click(function(){
		$("[data-show]").hide('slow');
		$('body').css('overflow-x','scroll');
	});

	$("[data-open-newTask]").click(function(){
		$("[data-show-newTask]").show('slow');
		$('body').css('overflow-x','hidden');
	});

	$("[data-close-newTask]").click(function(){
		$("[data-show-newTask]").hide('slow');
		$('body').css('overflow-x','scroll');
	});
}


$appFunctionalities.loadChat = function() {
	
	setTimeout(function() {
		var task_id = $('[data-Task-id]').data('Task-id');
		// if(task_id.trim()) {
			$('.comments-view')
			.load('/control/loadComments.controller.php?task_id='+task_id+'');
			$('.comments-view').animate({scrollTop: $('.comments-view').get(0).scrollHeight}, 200);
			$appFunctionalities.loadChat();
		// }
	},timeToRefreshComments);
}

$appFunctionalities.loadNewTasks = function() {
	var status = "n";
	var user_id = $('[data-user-id]').data('user-id');
	setTimeout(function() {
		$('#newTasks')
		.load('/control/loadTask.php?status='+status+'&user-id='+user_id+'');
		$appFunctionalities.loadNewTasks();
	},timeToRefreshTasks);
}

$appFunctionalities.loadUnderReviewTasks = function() {
	var status = "u";
	var user_id = $('[data-user-id]').data('user-id');
	setTimeout(function() {
		$('#underReviewTasks')
		.load('/control/loadTask.php?status='+status+'&user-id='+user_id+'');
		$appFunctionalities.loadUnderReviewTasks();
	},timeToRefreshTasks);
}

$appFunctionalities.loadDoneTasks = function() {
	var status = "d";
	var user_id = $('[data-user-id]').data('user-id'); 
	//alert(user_id);
	setTimeout(function() {
		$('#tasksDone')
		.load('/control/loadTask.php?status='+status+'&user-id='+user_id+'');
		$appFunctionalities.loadDoneTasks();
	},timeToRefreshTasks);
}

$appFunctionalities.loadNews = function() {
	setTimeout(function() {
		$('#General_news')
		.load('/control/loadNews.php');
		$appFunctionalities.loadNews();
	},timeToRefreshTasks);
}

$appFunctionalities.loadTasksDescription = function() {
	$('[data-task-id]').on('click',function(){
		var task_id = $(this).data('task-id');
		$('[data-Task-Approved]').data('Task-Approved',task_id);
		$('[data-Task-Inprogress]').data('Task-Inprogress',task_id);
		$('[data-Task-Completed]').data('Task-Completed',task_id);

		$('#taskDescription').fadeOut(10)
		.load('/control/taskDescription.php?task_id='+task_id+'')
		.fadeIn('fast');
	});
}

$appFunctionalities.buttonsPressed = function() {
	$('[data-Task-Approved]').on('click',function(){
		var _task_id = $('[data-Task-Approved]').data('Task-Approved');
		var _status = "approved"
		var _user_name = $('[data-user-id]').data('user-id');
		$.post('/control/functionality.controller.php',
		{'task_id':_task_id,'status':_status,'user_name':_user_name}, 
		function(data) {$appErrorDisplay.feedback(data);});
		$('[data-Task-Approved]').hide();
		$('[data-Task-Completed]').show();
	});

	$('[data-Task-Completed]').on('click',function(){
		var _task_id = $('[data-Task-Completed]').data('Task-Completed');
		var _status = "inaction"
		var _name = 'completed'
		var _user_name = $('[data-user-id]').data('user-id');
		$.post('/control/functionality.controller.php',
		{'task_id':_task_id,'status':_status,'name':name,'user_name':_user_name}, 
		function(data) {$appErrorDisplay.feedback(data);});
		$('[data-Task-Approved]').hide();
		$('[data-Task-Completed]').hide();
	});

	$('[data-Comment-Btn]').on('click',function(){
		var comment = $('#commentBox').val();
		var task_id = $('[data-Task-id]').data('Task-id');
		var user_id = $('[data-user-id]').data('user-id');
		if(comment.trim() && task_id.trim()) {
			$.post('/control/insertComment.php',
			{'task_id':task_id,'comment':comment,'user_id':user_id}, 
			function(data) {$appErrorDisplay.feedback(data);});
			$('#commentBox').val('');
		}
		else {
			$('#error-comment').html('!Please enter some text to comment').fadeIn('fast').fadeOut(5000);
		}

	});

}

$appFunctionalities.loading = function() {
	var timer = setTimeout(function() {
		if(loader < 10 ) {
			$('.loading').fadeOut("slow");
			$('.loading').fadeIn("slow");
			loader++;
			$appFunctionalities.loading();
		}
		else {
			clearTimeout(timer);
			$('.load-screen').fadeOut('slow');
			$('body').addClass('overflow-y','scroll');
		}
	},1000);
}

$appFunctionalities.login = function() {

}

$appFunctionalities.clicks = function() {
	$('[data-delete-id]').on('click',function(){
		var id = $(this).data('delete-id');
		$.post('/control/deleteComment.php',
		{'id':id}, 
		function(data) {$appErrorDisplay.feedback(data);});
	});
}


$appErrorDisplay.feedback = function(msg) {
	if(msg.trim()) {
		$('.feedback').html(msg);
		$('.feedback').fadeIn('slow');
		$('.feedback').fadeOut(5000);
	}
}

$(function(){
  $("#commentBox").keyup(function (e) {
    if (e.which == 13) {
      $('[data-Comment-Btn]').trigger('click');
    }
  });
});





