var sqlite3 = require("sqlite3").verbose();
var squel = require("squel");

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
		get_password_by_email : operate(_get_password_by_email)
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

var _add_new_topic = function(new_topic,db,onComplete){
	var insert_topic_query = get_insert_topic_query(new_topic).toString();
	var select_topicid_query = (squel.select().field('max(id)').from('topics')).toString();

	db.run(insert_topic_query,function(err){

		db.get(select_topicid_query,function(ert,topic){
			var select_startid_query = (squel.select().field('start_topic_ids').from('users')
				.where('email=?',new_topic.email)).toString();

			db.get(select_startid_query,function(err,user){
				var new_user_start_ids = [];
				if(!user.start_topic_ids)
					new_user_start_ids.push(topic['max(id)']);

				else{
					new_user_start_ids = JSON.parse(user.start_topic_ids);
					new_user_start_ids.push(topic['max(id)'])
				}

				var update_users_query = (squel.update().table("users")
			        .set("start_topic_ids",JSON.stringify(new_user_start_ids))
			        .where("email= ?",new_topic.email)
			    ).toString();

				db.run(update_users_query,function(er){
					onComplete(er,topic['max(id)']);
				})
			})
		})
	})
};

var get_search_topics_by_name_query = function(topic_name){
	return squel.select().field('id').field('name').from('topics')
		.where("name = '"+topic_name+"' OR description= '"+topic_name+"'")
};

var _search_topic_by_name = function(topic_name,db,onComplete){
	var query = get_search_topics_by_name_query(topic_name).toString();
	db.all(query,function(err,topics){
		onComplete(null,topics);
	});
};

var _get_password_by_email = function(email,db,onComplete){
	var query = squel.select().field("password").from("login").where("email='"+email+"'").toString();
	console.log("+++++++++++++++++")
	db.get(query,function(err,user){
		onComplete(null,user);
	})
};

exports.init =init;