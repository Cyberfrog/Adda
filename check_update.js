var exec = require('child_process').exec,
    child1,child2;

child1 = exec('git fetch --dry-run',
  function (error, stdout, stderr) {
  	stdout && set_env();
});

var set_env = function(){
	child2 = exec('sh environment.sh',
		function (error,stdout,stderr) {
			error && (console.log("shell error!"));
	});
}