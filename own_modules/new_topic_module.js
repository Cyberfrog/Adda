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

var get_insert_topic_query = function(new_topic){
	return (squel.insert()
        .into("topics")
    	    .set("name",new_topic.name)
        .set("description",new_topic.description)
        .set("start_time",new_topic.start_time)
        .set("email",new_topic.email)
 	)
};

var _add_new_topic = function(new_topic,db,onComplete){
	var insert_topic_query = get_insert_topic_query(new_topic).toString();
	// console.log("query--",insert_topic_query);
	db.run(insert_topic_query,function(err){
		onComplete(err);
	})

};

exports.init =init;