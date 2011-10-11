var http = require('http');
var gitweb = require('gitweb');
var fs = require('fs')
var url = require("url");

var options = {
    key: fs.readFileSync('tmp/pem.key')
    ,cert: fs.readFileSync('tmp/pem.cert')
}

http.createServer(require('stack')(
	function(req, res, next) {
		console.log("HEADERS: " + JSON.stringify(req.headers))
		var pathname = url.parse(req.url).pathname;
		console.log ("path : " + pathname)
  }, 
  gitweb('/', {
      projectroot: '/mnt/git',
      max_depth: 2
    })
)).listen(8080);