var lib = require("../own_modules/res_module.js");

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
		describe("registration",function(){
		it("registration of new user",function(done){
			var new_user = {name : 'Kaddoo',email : 'kaddoo@lauki.com',password : 'kaddoo123'};
			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>",new_user);
			res_module.get_new_user(new_user,function(err){
				assert.notOk(err);
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",new_user)
				assert.equal(new_user.email,'kaddoo@lauki.com')
				assert.equal(new_user.name,'Kaddoo');
				assert.equal(new_user.password,'kaddoo123');
				done();
			});
		});
	});
});