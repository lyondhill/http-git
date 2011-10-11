var https = require("https")
var http = require("http")
var cgi = require('cgi')
var fs = require('fs')
var url = require("url");

 var options = {
    key: fs.readFileSync('tmp/pem.key')
    ,cert: fs.readFileSync('tmp/pem.cert')
}
process.env["GIT_PROJECT_ROOT"] = "/mnt/git"

https.createServer(options, require('stack')(
	function(req, res, next) {
		console.log("HEADERS: " + JSON.stringify(req.headers))
		var pathname = url.parse(req.url).pathname;
		console.log ("path : " + pathname)

		authorization = req.headers.authorization;
		if (!authorization) {
			res.writeHead(401, {'Content-Type': 'text/plain'})
	  	res.end("NOT COOL BRO")
	  } else {
	  	pathArray = pathname.match(/^\/(\S*).git$/)
	  	app = pathArray[1]
	    var options = {
		    host: 'dashboard.newpagodabox.com'  // change /to api.newpagodabox.com.. prolly
		    ,port: 443
		    ,path: '/apps/' + app + '.json'
		    ,method: 'GET'
		    ,headers: {
	        "content-type": 'application/json'
	        ,'authorization': authorization
	    	}
			}
			console.log("options crated now requesting")
      var auth_request = https.request(options, function(auth_response) {
        auth_response.on('data', function(data) {
          if (auth_response.statusCode == "200") {
          	console.log("body")
          	console.log(data)
					  next() // IF this happens we move on to step 2 ENV veriables
          } else {
						console.log("HEADERS: " + JSON.stringify(auth_response.headers))
    				res.writeHead(404, {'Content-Type': 'text/plain'})
				  	res.end("I donno what your talking about\n")
          }
       	})
      })
      auth_request.end();

			auth_request.on('error', function(e) {
			  console.error(e);
			});
	  }
  },
  function(req, res, next) {
  	console.log("setting environment veriables")
		// var pathname = url.parse(req.url).pathname;

  	next()
  },
  cgi('./test.cgi', {}) // change this to cgi('git-http-backend')
)).listen(8080);