var req = require('request');

var imageUrl = "https://mmbiz.qlogo.cn/mmbiz/IySKyVze1WPsg8I1A2ZahvzIc4qxQibnvDD3jy50ZkbBBXibHXVQJUMZTUmbapl3LVibG8xoUfeG0IUSBWDrScFBQ/0?wx_fmt=jpeg";
const ress = req(imageUrl, function(err, res){
	// console.log(res.headers['content-type'])
})
ress.pipe(require('fs').createWriteStream('result.jpg'))

console.log(ress)