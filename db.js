'use strict';

const url = require('./config').db.url;
const MongoClient = require('mongodb').MongoClient;
let dbConn = null;
const TRY_MAX = 5;

const DB = {
	connect() {
		return new Promise(function (resolve, reject) {
			if (dbConn)  return resolve(dbConn);

			let times = 0;
			const cbFn = (err, db) => {
				if (err) {
					if (times++ === TRY_MAX)  return reject('can not connect mongodb: ' + url);
					else {
						setTimeout(()=> {
							MongoClient.connect(url, cbFn);
						}, 1000)
					}
				} else {
					resolve(dbConn = db);
				}
			};
			MongoClient.connect(url, cbFn);
		});
	}
};

DB.connect();

module.exports = DB;
