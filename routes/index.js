var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
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

module.exports = router;
