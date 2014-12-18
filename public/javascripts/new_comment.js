var onPageLoad =function(){
	$("#btn_comment").click(function(){
		var location = window.location.href.split('/');
		var content =$("#cmt_box").val();
		$.ajax({url:"/newComment/"+location[location.length-1],type:"POST",data:"content="+content});
	})
}
$(onPageLoad)