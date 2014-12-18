var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');
var new_topic_module = require('../own_modules/new_topic_module.js').init('./data/adda.db');
var user_module = require('../own_modules/user_module.js').init('./data/adda.db');
var res_module = require('../own_modules/res_module.js').init('./data/adda.db');

router.get('/', function(req, res) {
  res.render('index', { title: 'Adda' });
});

var requireLogin = function(req,res,next){
	req.user? next(): res.redirect('/login');
};
router.get('/topic/:id', function(req, res) {
	topic_module.get_topic_summary(req.params.id,function(err,topic){
		
  		res.render('topic',topic);
	})
})

router.get('/getComments/:id', function(req, res) {
	topic_module.get_comments(req.params.id,function(err,comments){
  		res.json(comments);
	})
})

router.post('/newComment/:id', function(req, res) {
	var newComment = {
		content:req.body.content,
		email:req.session.user,
		topic_id:req.params.id
	}
	console.log(".......");
	topic_module.add_new_comment(newComment,function(err){
	  res.end();
	})
})

router.get('/topics',function(req, res){
	var topic_name =req.query.searchby;
	if(topic_name){
		new_topic_module.search_topic_by_name(topic_name,function(err,topics){
			res.render('topics',{topics:topics})
		})
		return;
	}
	res.render('topics');
})

router.post('/topics',function(req, res){
	var new_topic = req.body;
	new_topic.email = req.session.user;
	new_topic_module.add_new_topic(new_topic,function(err,id){
		res.redirect('topic/'+id)
	})
})

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {

  var result = req.body;
  res_module.insert_new_user(result,function(err){
  	req.session.user = result.email;
  	res.redirect('/dashboard');
  });
});


router.get('/dashboard', function(req, res) {
  user_module.get_user_summary(req.session.user,function(err,user){
  	console.log("...",user);
  		res.render('dashboard',user);
  })
});

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",function(req,res){
	var user = req.body;
	new_topic_module.get_password_by_email(user.email,function(err,existing_user){
		if(user.password == existing_user.password){
			req.session.user = user.email;
  			res.redirect('/dashboard');
		}
		else
		res.redirect('/login');	
	})
});


module.exports = router;
