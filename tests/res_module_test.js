var lib = require("../own_modules/res_module.js");
var user_module = require("../own_modules/user_module.js").init('tests/data/adda.db');


var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';

var res_module;
describe('res_module',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		res_module = lib.init(TEST_DB_PATH);
	});

	describe('#insert_new_user',function(){
		it('inserts new registered user',function(done){
			var new_user = {name : 'Kaddoo',email:'kaddoo@lauki.com',password : 'kaddoo123'};
			res_module.insert_new_user(new_user,function(err){
				assert.notOk(err);
				user_module.get_user_summary(new_user.email,function(err,user){
					assert.equal(user.name,"Kaddoo");
					// assert.equal(user.password,"kaddoo123");
					done();
				});
			});
		});
	});
});


// describe('#addNewSubject',function(){
// 		it('add new subject',function(done){
// 			var new_subject = {'$subject_name':"French",'$grade_id':1,'$maxScore':50};
// 			school_records.addNewSubject(new_subject,function(err){
// 				assert.notOk(err);
// 				school_records.getSubjectSummary(4,function(est,s){
// 					assert.equal(s.length,4);
// 					assert.equal(s[0].score,'-');
// 					assert.equal(s[0].subject_name,'French');
// 					assert.equal(s[0].grade_name,'1st std');
// 					assert.equal(s[0].maxScore,50);
// 					done();
// 				});
// 			});
// 		});
// 	});