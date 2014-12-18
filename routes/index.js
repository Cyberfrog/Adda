var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/topic/:id', function(req, res) {
	topic_module.get_topic_summary(req.params.id,function(err,topic){
  		res.render('topic',topic);
	});
});

module.exports = router;
