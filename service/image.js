/**
 * image services, retrive, pickup from fs ...
 */
const Image = require('../model/image');
const fs = require('fs');
const request = require('request');
const basePath = require('../config').path;

const _path = (image)=> {
	return basePath + image._id + '.' + image.extention;
};

const imageService = {
	saveImage(image){
		return new Promise(function (resolve, reject) {
			if (!image instanceof Image) {
				return reject('image must be instance of Image');
			}
			const res = request(image.url);
			//save to mongodb
			image.insert(function (err) {
				if (err) return reject(err);
				else {
					//save file
					const fstream = fs.createWriteStream(_path(image));

					request(image.url).pipe(fstream)
						.on('error', reject)
						.on('end', resolve);
				}
			});
		});
	},
	getImage(media_id, url){
		const self = this;
		return new Promise(function (resolve, reject) {
			Image.findByMediaId(media_id).then(function (image) {
				if(!image){
					self.saveImage(new Image(null, media_id, url, TODO, new Date()))//TODO
				}
				//check updateTime
				if (!image || Date.now() < new Date(image.update_time).getTime()) {
					return _upsertImage(image, (err, stream) => {
						err ? reject(err) : resolve(stream);
					}).then(resolve, reject);
				}
				resolve(fs.createReadStream(_path(image)));
			}, reject);
		});
	}
};

function _upsertImage(image, callback) {
	Image.update(image.id, {update_time: new Date()})
		.catch(console.error);
	const fstream = fs.createWriteStream(_path(image));

	request(image.url).pipe(fstream)
		.on('error', callback)
		.on('end', () => {
			callback()
		});
}

module.exports = imageService;

