const fs = require('fs');
const imageService = require('../service/image');

const imageUrl = "https://mmbiz.qlogo.cn/mmbiz/IySKyVze1WPsg8I1A2ZahvzIc4qxQibnvDD3jy50ZkbBBXibHXVQJUMZTUmbapl3LVibG8xoUfeG0IUSBWDrScFBQ/0?wx_fmt=jpeg";
imageService.getImage(1, imageUrl).then(stream => {
	const path = './test.jpg';
	stream.pipe(fs.createWriteStream(path))
		.on('end', () => {
			fs.stat(path, console.info);
		});
}).catch(console.error);