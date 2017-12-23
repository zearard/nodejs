function Server()
{
	Msg = console;
	Msg.debug = console.log;

	const
		http         = require('http'),
		fs           = require('fs'),
		path         = require('path'),
		env          = process.env;

	var contentTypes = {
		'html' : 'text/html',
		'css'  : 'text/css',
		'tag'  : 'text/html',
		'ico'  : 'image/x-icon',
		'png'  : 'image/png',
		'svg'  : 'image/svg+xml'
	}
	
	var pathClient = './proj/test/client/pub';
	var fileLog = pathClient + "/tmp/log.txt";

	//var host = env.NODE_IP || 'localhost';
	//var port = env.NODE_PORT || 8080;
	var host = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

	if(process.argv[2] && process.argv[3]) {
		host = process.argv[2];
		port = process.argv[3];
	}else {
		if(process.env.OPENSHIFT_NODEJS_IP && process.env.OPENSHIFT_NODEJS_PORT) {
			host = process.env.OPENSHIFT_NODEJS_IP;
			port = process.env.OPENSHIFT_NODEJS_PORT;
		}
	}

	var server = http.createServer(function (req, res) {
		var url = req.url;
		if (url == '/') url += 'index.html';
		Msg.debug(`get url: ` + url + `   (pid: ${process.pid}) host: http://${host}:${port}`);

		if (url == '/response-facebook-account-kit') {
		}
		var dataPost = '';
		req.on('data', function(data) {
			dataPost += data.toString();
		});
		req.on('end', function() {
			if(dataPost != '') {
				Msg.debug('post data: ' + dataPost);
				fs.appendFile(fileLog, 'post data: ' + dataPost + '\n');
			}
		});

		switch (url) {
			case '/response-facebook-account-kit':
				res.end('true');
				break;

			default:
				fs.readFile(pathClient + url, function (err, data) {
					if (err) {
						res.writeHead(404);
						res.end('Not found ' + url);
					} else {
						var ext = path.extname(url).slice(1);
						if (contentTypes[ext]) {
							res.setHeader('Content-Type', contentTypes[ext]);
						}
						if (ext === 'html') {
							res.setHeader('Cache-Control', 'no-cache, no-store');
						}
						res.end(data);
					}
				});
				break;
		}
	});

	server.listen(port, host, function () {
		Msg.info('HTTP server pid: '+process.pid+' listen on host http://'+host+':'+port+'...');
	});
}

module.exports = Server;
