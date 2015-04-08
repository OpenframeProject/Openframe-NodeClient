#! /usr/local/bin/node

var program = require('commander')
 
program
  .version('0.0.1')
  .option('-u, --username <username>', 'Username to which this frame will be linked.')
  .option('-r, --root <root>', 'The root domain at which the frame server is accessible.')
  .parse(process.argv)
 
if (!program.username) {
	console.log('Username is required.')
	program.outputHelp()
	process.exit()
} else {
	console.log('Starting as ' + program.username);
}

var username = program.username,
	root_domain = program.root || "localhost:8888";

var connect = require('connect')
var http = require('http')
var serveStatic = require('serve-static')
var open = require('open')
var exec = require('child_process').exec

 
var app = connect()

app.use('/config', function(req, res, next) {
	var resp = {
		root_domain: root_domain,
		username: username
	}
	res.end(JSON.stringify(resp));
});

app.use(serveStatic('./static', {'index': ['frame.html']}))


function getUser() {
	return username;
}
// respond to all requests 
// app.use(function(req, res){
//   res.end('Hello from Connect!\n');
// })
 
//create node.js http server and listen on port 
http.createServer(app).listen(3000)

// if we're on linux, let's try to open the thing with chromium in kiosk mode
if(/^linux/.test(process.platform)) {
	console.log('linux');
	exec('chromium --kiosk http://localhost:3000', function (error, stdout, stderr) {
		console.log(error, stdout, stderr);
	});
} else {
	console.log('not linux');
	open("http://localhost:3000");
}

