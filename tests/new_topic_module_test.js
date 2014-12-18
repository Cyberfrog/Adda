var lib = require("../own_modules/new_topic_module.js");
var topic_module = require("../own_modules/topic_module.js").init('tests/data/adda.db');

var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';

var new_topic_module;
describe('#new_topic_module',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		new_topic_module = lib.init(TEST_DB_PATH);
	});
	describe("#add_new_topic",function(){
		it("#adds a new topic step",function(done){
			var new_topic = {
				name : 'step',
				description : 'software technology excellence programme',
				email : 'ankur@ex.com',
				start_time : 000001
			}
			new_topic_module.add_new_topic(new_topic,function(err){
				assert.notOk(err);
				topic_module.get_topic_summary(3,function(err,topic){
					assert.equal(topic.name,'step');
					assert.equal(topic.description,'software technology excellence programme');
					assert.equal(topic.start_time,000001);
					assert.equal(topic.close_time,undefined);
					assert.equal(topic.admin,'ankur');
					assert.lengthOf(topic.comments,0);
					setTimeout(done,1);
				})

				//check in users table whether topic start updated or not
			})
		})
	})

	describe('#search_topic_by_name',function(){
		it('#gives all topics starting with name sachin',function(done){
			new_topic_module.search_topic_by_name('sachin',function(err,topics){
				assert.lengthOf(topics,1);
				assert.deepEqual(topics[0],{id:2,name:"sachin"});
				done();
			})
		})
	})
	describe('#get_password_by_email',function(){
		it('#gives password of email_id ankur@ex.com',function(done){
			new_topic_module.get_password_by_email('ankur@ex.com',function(err,user){
				assert.notOk(err);
				assert.equal(user.password,'ankur12345');
				done();
			})
		})
	})
});