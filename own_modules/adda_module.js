var _ =require('lodash');
var lib={};
exports.lib = lib;
lib.get_last5_comments=function(comments){
	return _.last(_.sortBy(comments,'time'),5);
}