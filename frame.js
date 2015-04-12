#! /usr/local/bin/node

var program = require('commander')
 
program
  .version('0.0.1')
  .option('-u, --username <username>', 'Username to which this frame will be linked.')
  .option('-d, --dom <dom>', 'The root domain (including port) at which the frame server is accessible. Defaults to localhost:8888.')
  .option('-c, --chromium', 'If this flag is present, force the use chromium.')
  .parse(process.argv)

if (!program.username) {
	console.log('Username is required.')
	program.outputHelp()
	process.exit()
} else {
	console.log('Starting as ' + program.username);
}

var username = program.username,
	root_domain = program.dom || "localhost:8888",
	chromium = program.chromium;

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
http.createServer(app).listen(7000)

// if we're on linux, let's try to open the thing with chromium in kiosk mode
if(/^linux/.test(process.platform)) {
	console.log('linux', process.platform);
	var xinitrc_path = __dirname + '/bin/.xinitrc';
	exec('xinit ' + xinitrc_path, function (error, stdout, stderr) {
		console.log(error, stdout, stderr);
	});
} else {
	console.log('not linux', process.platform);
	if(chromium) {
		exec('/Applications/Chromium.app/Contents/MacOS/Chromium --kiosk http://localhost:7000', function (error, stdout, stderr) {
			console.log(error, stdout, stderr);
		});
	} else {
		open("http://localhost:7000");
	}
}

