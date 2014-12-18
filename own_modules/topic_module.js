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
		get_topic_summary:operate(_get_topic_summary)		
	};
	return records;
};


var _get_topic_summary = function(id,db,onComplete){

};
exports.init =init;