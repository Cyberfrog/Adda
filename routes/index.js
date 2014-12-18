var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');
var new_topic_module = require('../own_modules/new_topic_module.js').init('./data/adda.db');
var res_module = require('../own_modules/res_module.js').init('./data/adda.db');

router.get('/', function(req, res) {
  res.render('index', { title: 'Adda' });
});
router.use(function(req,res,next){
	req.session={user:"ankur@ex.com"};
	next();
})
router.get('/topic/:id', function(req, res) {
	topic_module.get_topic_summary(req.params.id,function(err,topic){
		
  		res.render('topic',topic);
	});
});
router.get('/getComments/:id', function(req, res) {
	topic_module.get_comments(req.params.id,function(err,comments){
  		res.json(comments);
	});
});
router.post('/newComment/:id', function(req, res) {
	var newComment = {
		content:req.body.content,
		email:req.session.user,
		topic_id:req.params.id
	}
	console.log(".......");
	topic_module.add_new_comment(newComment,function(err){
	  res.end();
	});
});

router.get('/topics',function(req, res){
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
  console.log("-----------------------------<>>>>>>",result);
  res_module.insert_new_user(result,function(err){
  	req.session.user = result.email;
  	res.redirect('/dashboard');
  });
});

router.get('/dashboard',function(req, res){
	res.render('dashboard');
})

module.exports = router;
