var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');
var new_topic_module = require('../own_modules/new_topic_module.js').init('./data/adda.db');

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
router.post('/newComment/:id', function(req, res) {
	var newComment = {
		content:req.body.content,
		email:req.session.user,
		topic_id:req.params.id
	}
	console.log(".......");
	topic_module.add_new_comment(newComment,function(err){
		console.log('redirect');
		res.redirect("/topic/"+newComment.topic_id);
	});
});

router.get('/topics',function(req, res){
	res.render('topics');
})

router.post('/topics',function(req, res){
	var new_topic = req.body;
	// new_topic.email = req.session.user
	new_topic.email = "ankur@ex.com"
	console.log("~~~",new_topic);
	res.end("done")
	// new_topic_module.add_new_topic(new_topic,function(err){
	// 	res.redirect('topics')
	// })
})


















































router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var result = userStore.save({
  	Name:req.body.name,
  	email:req.body.email,
  	password:req.body.password
  });
  result.error ? res.render('register',result) : res.redirect('/dashboard');  
});

module.exports = router;