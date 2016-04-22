const UUID = require('uuid');

exports.uuid = function () {
	return UUID.v4().replace(/-/g, '');
};