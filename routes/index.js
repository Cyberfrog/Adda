var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');
var new_topic_module = require('../own_modules/new_topic_module.js').init('./data/adda.db');

router.get('/', function(req, res) {
  res.render('index', { title: 'Adda' });
});

router.get('/topic/:id', function(req, res) {
	topic_module.get_topic_summary(req.params.id,function(err,topic){
  		res.render('topic',topic);
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
	new_topic_module.add_new_topic(new_topic,function(){
		
	})
})

module.exports = router;
