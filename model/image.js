const uuid = require('../utils').uuid;
const DB = require('../db');
const collName = 'images';

/**
 * @param media_id
 * @param url
 * @param extention
 * @param update_time
 * @param _id
 */
function Image(_id, media_id, url, extention, update_time) {
	this._id = _id || uuid();
	this.media_id = media_id;
	this.url = url;
	this.extention = extention;
	this.update_time = update_time;
}

Image.prototype.insert = () => {
	const self = this;
	//params check ignore...
	return new Promise(function (resolve, reject) {
		DB.connect().then(db => {
			const coll = db.collection(collName);
			coll.insertMany([self], err => {
				if (err) return reject(err);
				resolve(null);
			});
		});
	});
};

Image.findByMediaId = (media_id) => {
	return new Promise(function (resolve, reject) {
		DB.connect().then(db => {
			const coll = db.collection(collName);
			coll.find({media_id: media_id}).toArray((err, docs) => {
				if (err) return reject(err);
				resolve(docs[0]);
			});
		});
	});
};

Image.updateByMediaId = (media_id, obj) => {
	return new Promise(function (resolve, reject) {
		DB.connect().then(db => {
			const coll = db.collection(collName);
			coll.updateOne({media_id: media_id}, {$set: obj}, (err) => {
				if (err) return reject(err);
				resolve(null);
			});
		});
	});
};

Image.update = (_id, obj) => {
	return new Promise(function (resolve, reject) {
		DB.connect().then(db => {
			const coll = db.collection(collName);
			coll.updateOne({_id: _id}, {$set: obj}, (err) => {
				if (err) return reject(err);
				resolve(null);
			});
		});
	});
};

module.exports = Image;

