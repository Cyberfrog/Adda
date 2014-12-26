var sqlite3 = require("sqlite3").verbose();
var squel = require("squel");
var _ = require("lodash");
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
		add_new_topic : operate(_add_new_topic),
		search_topic_by_name : operate(_search_topic_by_name),
		get_password_by_email : operate(_get_password_by_email),
		get_top_5_topics : operate(_get_top_5_topics)
	};
	return records;
};

var get_insert_topic_query = function(new_topic){
	return (squel.insert().into("topics")
    	.set("name",new_topic.name)
        .set("description",new_topic.description)
        .set("start_time",new_topic.start_time)
        .set("email",new_topic.email)
 	)
};

var get_new_topic_query = function(email){
	return (squel.select().field('start_topic_ids').from('users')
				.where('email=?',email)).toString();
};

var get_update_users_query = function(new_topic,new_user_start_ids){
	return (squel.update().table("users")
			.set("start_topic_ids",JSON.stringify(new_user_start_ids))
			.where("email= ?",new_topic.email)).toString();
};

var get_update_topic = function(db,update_users_query,max_id,onComplete){
	db.run(update_users_query,function(er){
		onComplete(er,max_id);
	})
};

var get_user_from_startid = function(user,new_user_start_ids,max_id){
	if(!user.start_topic_ids){ 
		new_user_start_ids.push(max_id);
		return new_user_start_ids;
	}
	new_user_start_ids = JSON.parse(user.start_topic_ids);
	new_user_start_ids.push(max_id);
	return new_user_start_ids;
};

var get_select_for_maxid = function(){
	return (squel.select().field('max(id)').from('topics')).toString();
};

var get_user_detail = function(db,new_topic,select_startid_query,max_id,onComplete){
	db.get(select_startid_query,function(err,user){
		var new_user_start_ids = [];
		new_user_start_ids=get_user_from_startid(user,new_user_start_ids,max_id);
		var update_users_query = get_update_users_query(new_topic,new_user_start_ids);
		get_update_topic(db,update_users_query,max_id,onComplete)
	})
};

var get_topic_id = function(db,new_topic,select_topicid_query,onComplete){
	db.get(select_topicid_query,function(ert,topic){
		var select_startid_query = get_new_topic_query(new_topic.email);
		var max_id = topic['max(id)'];
		get_user_detail(db,new_topic,select_startid_query,max_id,onComplete);
	})
};

var _add_new_topic = function(new_topic,db,onComplete){
	new_topic.start_time=new Date().getTime();
	var insert_topic_query = get_insert_topic_query(new_topic).toString();
	var select_topicid_query = get_select_for_maxid();

	db.run(insert_topic_query,function(err){
		get_topic_id(db,new_topic,select_topicid_query,onComplete);		
	})
};

var get_search_topics_by_name_query = function(topic_name){
	return 
};

var _search_topic_by_name = function(topic_name,db,onComplete){
	var search_query = 'select id,name from topics where name LIKE "%'+topic_name.toLowerCase()+'%"';
	db.all(search_query,onComplete);
};

var _get_password_by_email = function(email,db,onComplete){
	var query = squel.select().field("password").from("login").where("email='"+email+"'").toString();
	db.get(query,function(err,user){
		onComplete(null,user);
	})
};

var get_all_topicid_query = function(){
	return squel.select().from("comments").field("topic_id").order("time");
};

var get_top_5_topics = function(id){
	return squel.select().from("topics").field("name").where("id="+id);
};

var getTopicIds = function(comments){
	return comments.map(function(c){
		return c.topic_id;
	})
}
var _get_top_5_topics = function(db,onComplete){
	var all_topic_names = [];
	var comment_query= get_all_topicid_query().toString();

	db.all(comment_query,function(err,comments){
		var ids = getTopicIds(comments)
		ids = _.uniq(ids).reverse();
		
		ids.forEach(function(id,index){
			var topic_query = get_top_5_topics(id).toString();
			var complet = new Function();
			if(index == 4 || index == ids.length-1 ){
				complet=onComplete;
			}
			db.get(topic_query,function(err,topic){
				all_topic_names.push(topic.name);
				complet(null,all_topic_names);
			})
		})
	})
};

exports.init =init;