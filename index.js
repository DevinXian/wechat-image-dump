'use strict';

const fs = require('fs');
const URL = require('url');
const http = require('http');
const config = require('./config');
const ImageService = require('./service/image');

(function init() {
	fs.exists(config.path, exists => {
		if (!exists) fs.mkdir(config.path);
	});
})();

http.createServer(function (req, res) {

	if (!/^\/service\/image/.test(req.url)) {
		res.writeHead(404);
		return res.end('incorrect service url');
	}

	const urlObj = URL.parse(req.url, true);
	const media_id = urlObj.query.media_id;
	const url = urlObj.query.url;
	if (!media_id || !url) {
		res.writeHead(404);
		return res.end('media_id not defined');
	}

	ImageService.getImage(media_id, url, parseInt(urlObj.query.update_time))
		.then(file => {
			res.writeHead(200);
			fs.createReadStream(file)
				.pipe(res)
				.on('end', res.end);
		})
		.catch(err => {
			console.error(err);
			res.writeHead(500);
			res.end('Server Error');
		});

}).listen(config.app.port || 3000);

process.on('uncaughtException', console.error);

console.info('server started on port ' + config.app.port || 3000);