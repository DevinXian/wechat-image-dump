/**
 * image services, retrive, pickup from fs ...
 */
'use strict';

const fs = require('fs');
const mime = require('mime');
const request = require('request');
const Image = require('../model/image');
const basePath = require('../config').path;

const _path = (image) => {
	return basePath + image._id + '.' + image.extention;
};

const imageService = {
	/**
	 * save file and mongodb records
	 * @param media_id - wechat media_id
	 * @param url - wechat material url
	 * @param [time] - wechat material update time
	 * @param callback
	 */
	saveImage(media_id, url, time, callback){
		let path = null, src, headReq, image;

		headReq = request.head(url)
			.on('error', callback)
			.on('response', res => {
				const extention = mime.extension(res.headers['content-type']);
				image = new Image(null, media_id, url, extention, new Date(time));
				image.insert(err => {
					if (err) return console.error(err)
				});
			})
			.on('end', () => {
				(src = request.get(url))
					.on('end', ()=> {
						callback(null, path);
					})
					.pipe(fs.createWriteStream(path = _path(image)));
			});
	},
	/**
	 * get image, update if necessary
	 * @param media_id - wechat media_id
	 * @param url - wechat material url
	 * @param [update_time] - wechat material update time
	 * @returns {Promise}
	 */
	getImage(media_id, url, update_time){
		const self = this;

		return new Promise(function (resolve, reject) {
			Image.findByMediaId(media_id).then(image => {
				const _cb = (err, data) => {
					err ? reject(err) : resolve(data);
				};
				if (!image)  return self.saveImage(media_id, url, update_time || new Date(), _cb);
				//check updateTime
				if (update_time && checkExpire(update_time))
					return _updateImage(image, url, update_time || new Date(), _cb);

				resolve(_path(image));
			}, reject);
		});
	}
};

function _updateImage(image, url, time, callback) {
	let path = null, src;

	src = request.get(image.url)
		.on('response', res => {
			image.extention = mime.extension(res.headers['content-type']);
			Image.update(image._id, {url: url, update_time: new Date(time)})
				.catch(console.error);

			src.pipe(fs.createWriteStream(path = _path(image)));
			src.on('end', () => {
				callback(null, path);
			});
		})
		.on('error', callback);
}

function checkExpire(time) {
	return Date.now() < new Date(time).getTime();
}

module.exports = imageService;

