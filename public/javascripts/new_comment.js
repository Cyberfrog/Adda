var  loadComments = function(){
	$.ajax("/getComments/"+getId())
		.done(function(data){
			console.log(data);
			var listed_data =getList(data);
			$("#allComments").html(listed_data);
		});
}
var getList = function(comments){
	return comments.map(function(comment){
		return '<li><div>'+comment.name+": "+comment.content+"<br>"+comment.time+"</div></li>";
	}).join("\r\n");
}
var getId = function(){
	var location = window.location.href.split('/');
		var id = location[location.length-1];
		return id;
}
var onPageLoad =function(){
	$("#btn_comment").click(function(){
		var id = getId();
		var content =$("#cmt_box").val();
		$.ajax({url:"/newComment/"+id,type:"POST",data:"content="+content})
		.done(function(){
			window.location.href = "/topic/"+id;
		});
	});
	$("#btn_loadComplete").click(loadComments)
}

$(onPageLoad)