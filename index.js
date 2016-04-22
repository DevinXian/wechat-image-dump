'use strict';

const fs = require('fs');
const mime = require('mime');
const http = require('http');
const URL = require('url');
const config = require('./config');
const ImageService = require('./service/image');


http.createServer(function (req, res) {

	if (!/^\/service\/image/.test(req.url)) {
		res.writeHead(404);
		return res.end('incorrect service url');
	}

	const urlObj = URL.parse(req.url, true);
	const media_id = urlObj.query.media_id;
	const url = urlObj.query.url;
	if (!media_id || urlObj.query.url) {
		res.writeHead(404);
		return res.end('media_id not defined');
	}

	ImageService.getImage(media_id, url)
		.then(stream => {
			res.writeHead(200);
			stream.pipe(res);
		})
		.catch(err => {
			console.error(err);
			res.writeHead(500);
			res.end('豆豆豆豆出问题了');
		});

}).listen(config.app.port || 3000);