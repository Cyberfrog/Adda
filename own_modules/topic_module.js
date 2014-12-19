var sqlite3 = require("sqlite3").verbose();
var squel = require("squel");
var lib = require("../own_modules/adda_module.js").lib;

var init = function(location){
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];

			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};	
	};

	var records  = {
		get_topic_summary:operate(_get_topic_summary),
		add_new_comment:operate(_add_new_comment),
		get_comments:operate(_get_comments),
		check_status:operate(_check_status)
	};
	return records;
};


var _get_topic_summary = function(id,db,onComplete){
	var topic_query = " select t.id , t.name, t.description , t.start_time , t.closed_time , u.name as admin "+
						"from topics t , users u where t.id ="+ id + " and u.email = t.email ";
	
	db.get(topic_query,function(err,topic){
		_get_comments(id,db,function(err,comments){
			topic.id=id;
			topic.comments = lib.get_last5_comments(comments);
			onComplete(err,topic);
		})
	});
};
var _check_status = function(request,db,onComplete){
	var user_query = "select join_topic_ids,start_topic_ids from users where email= '"+request.user+"'";
	db.get(user_query,function(err,user){
		var join_ids = user.join_topic_ids?JSON.parse(user.join_topic_ids):[];
		var start_ids = user.start_topic_ids?JSON.parse(user.start_topic_ids):[];
		var status = {starter:isPresent(start_ids,request.topic_id),
			participate:isPresent(join_ids,request.topic_id)};
		onComplete(err,status);
	})
}
var isPresent= function(collection,element){
	return collection.indexOf(+element)>=0;
}
var _get_comments =function(id, db, onComplete){
	var comment_query = "select c.time, c.content,u.name from comments c,users u where c.topic_id="+
						id+" and u.email = c.email";
	db.all(comment_query,function(err,comments){
		onComplete(err,comments);
	});
}
var _add_new_comment = function(new_comment,db,onComplete){
	var comment_query ="insert into comments(content,topic_id,time,email) values($content ,$topic_id, $time, $email)";
	var comment_query_params = {"$content":new_comment.content,
								"$topic_id":new_comment.topic_id,
								"$time":new Date().getTime(),
								"$email":new_comment.email};
	db.run(comment_query,comment_query_params,function(err){
		onComplete(err);
	})							
};

exports.init =init;