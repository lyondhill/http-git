var gitweb = require('gitweb');
var fs = require('fs')
var url = require("url");

var options = {
    key: fs.readFileSync('tmp/pem.key')
    ,cert: fs.readFileSync('tmp/pem.cert')
}

require('https').createServer(options, require('stack')(
	function(req, res, next) {
		console.log("HEADERS: " + JSON.stringify(req.headers))
		var pathname = url.parse(req.url).pathname;
		console.log ("path : " + pathname)
  })
).listen(443, "git.pagodabox.com");