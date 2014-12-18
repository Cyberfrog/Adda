var lib = require("../own_modules/topic_module.js");
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';

var adda_records;
describe('adda_records',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		adda_records = lib.init(TEST_DB_PATH);
	});
	describe("get_topic_summary",function(){
		it("get information about topic 1",function(done){
			adda_records.get_topic_summary(1,function(err,topic){
				// topic.name,topic.description,topic.start_time,
				// topic.close_time,topic.admin,topic.comments[{}]
				assert.equal(topic.name,'cricket');
				assert.equal(topic.description,'sachin tendulkar');
				assert.equal(topic.start_time,12345);
				assert.equal(topic.close_time,undefined);
				assert.equal(topic.admin,'dolly');
				assert.lengthOf(topic.comments,2);
				done();	
			});
		})
	})
});