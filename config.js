const path = require('path');

module.exports = {
	db: {
		url: 'mongodb://localhost:27017/test'
	},
	app: {
		port: 3000
	},
	path: path.join(__dirname, 'images') + '/'
};