var fs = require('fs')
var url = require("url")
var cgi = require('cgi');

var options = {
    key: fs.readFileSync('tmp/pem.key')
    ,cert: fs.readFileSync('tmp/pem.cert')
}

require('https').createServer(options, require('stack')(
	function(req, res, next) {
		console.log("HEADERS: " + JSON.stringify(req.headers))
		var pathname = url.parse(req.url).pathname;
		console.log ("path : " + pathname)
	},
	cgi('git http-backend', {
		PATH_INFO: "/mnt/git" + pathname,
		REMOTE_USER: "lyon",
		REMOTE_ADDR: "127.0.0.1",
		CONTENT_TYPE: req.headers.accept,
		QUERY_STRING: url.parse(req.url).query,
		REQUEST_METHOD: req.method
	}))


).listen(443, "50.97.133.246");