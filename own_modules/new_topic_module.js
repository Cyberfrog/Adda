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
		add_new_topic : operate(_add_new_topic)
	};
	return records;
};

var get_update_users_query = function(db,new_topic){
	var topic_id;
	var new_user_start_ids;
	var update_users_query;
	var select_topicid_query = (squel.select().field('max(id)').from('topics')).toString();
	
	db.get(select_topicid_query,function(ert,topic){
		topic_id = topic['max(id)'];
	})

	var select_startid_query = (squel.select().field('start_topic_ids').from('users').where('email=?',new_topic.email)).toString();
	
	db.get(select_startid_query,function(err,user){
		if(user.start_topic_ids == null)
			new_user_start_ids = [topic_id];
		else
			new_user_start_ids = JSON.parse(user.start_topic_ids).push(topic_id);
		update_users_query = (squel.update()
	        .table("users")
	        .set("start_topic_ids",new_user_start_ids)
	        .where("email= ?",new_topic.email)
	    )

	})
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
				var new_user_start_ids;
				if(user.start_topic_ids == null)
					new_user_start_ids = [topic['max(id)']];
				else
					new_user_start_ids = JSON.parse(user.start_topic_ids).push(topic['max(id)']);


				var update_users_query = (squel.update()
			        .table("users")
			        .set("start_topic_ids",JSON.stringify(new_user_start_ids))
			        .where("email= ?",new_topic.email)
			    ).toString();
				
				db.run(update_users_query,function(er){
					console.log("er",er)
					onComplete(er);
				})
			})
		})
	})
};

exports.init =init;