#! /usr/local/bin/node

var program = require('commander');

program
    .version('0.0.1')
    .option('-u, --username <username>', 'Username to which this frame will be linked.')
    .option('-f, --framename <framename>', 'Name for the frame.')
    .option('-d, --dom <dom>', 'The root domain (including port) at which the frame server is accessible. Defaults to localhost:8888.')
    .option('-r, --reset', 'If present, reset the configuration, i.e. treat this as an entirely new frame.')
    .option('-c, --chromium', 'If this flag is present, force the use chromium.')
    .parse(process.argv);

if (!program.username) {
    console.log('Username is required.');
    program.outputHelp();
    process.exit();
} else {
    console.log('Starting as ' + program.username);
}

var username = program.username,
    root_domain = program.dom || "localhost:8888",
    chromium = program.chromium,
    reset = program.reset,
    framename = program.framename || 'New Frame';

var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');
var open = require('open');
var uuid = require('node-uuid');
var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request-json');
var client = request.createClient('http://'+root_domain);
var conf;


// If reset flag is present, remove the conf
if (reset) fs.unlinkSync('./conf.json');


var app = connect();

app.use('/config', function(req, res, next) {
    res.end(JSON.stringify(conf));
});

app.use(serveStatic('./static', {
    'index': ['frame.html']
}));


// try to get frame conf from local file:
try {
    conf = require('./conf.json');
    if (conf.owner !== username || conf.name !== framename) {
    	// TODO: if the supplied user or framename don't match the conf, update the frame on the server?
    	var frame = {
	        owner: username,
	        users: [username],
	        name: framename
	    };
    	client.put('/frames/'+conf._id.$oid, frame, function(err, res, body) {
	    	if (err) console.log(err);
	    	console.log("body", body);
	    	if (res.statusCode === 200) {
	    		createConfigFile(body);
	    		conf = body;
	    		conf.root_domain = root_domain;
	    		startServer();
	    	}
	    });
    } else {
	    conf.root_domain = root_domain;
	    if (conf) startServer();   	
    }
} catch (e) {
    // no conf file, create new frame and save resulting conf
    var frame = {
        owner: username,
        users: [username],
        name: framename,
        active: false
    };

    client.post('/frames', frame, function(err, res, body) {
    	if (err) console.log(err);
    	console.log("body", body);
    	if (res.statusCode === 200) {
    		createConfigFile(body);
    		conf = body;
    		conf.root_domain = root_domain;
    		startServer();
    	}
    });
}


function createConfigFile(conf) {
    fs.writeFile('conf.json', JSON.stringify(conf), function(err) {
        if (err) {
            console.log(err);
        }
    });
}


//create node.js http server and listen on port 
function startServer() {
	http.createServer(app).listen(7000);	
	launchFrame();
}


function launchFrame() {
	// if we're on linux, let's try to open the thing with chromium in kiosk mode
	if (/^linux/.test(process.platform)) {
	    console.log('linux', process.platform);
	    var xinitrc_path = __dirname + '/bin/.xinitrc';
	    exec('xinit ' + xinitrc_path, function(error, stdout, stderr) {
	        console.log(error, stdout, stderr);
	    });
	} else {
	    console.log('not linux', process.platform);
	    if (chromium) {
	        exec('/Applications/Chromium.app/Contents/MacOS/Chromium --kiosk http://localhost:7000', function(error, stdout, stderr) {
	            console.log(error, stdout, stderr);
	        });
	    } else {
	        open("http://localhost:7000");
	    }
	}	
}



