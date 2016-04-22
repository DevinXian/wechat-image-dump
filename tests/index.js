const Image = require('../model/image');

const mockImage = {
	media_id: '1',
	
};
let imageUrl = "https://mmbiz.qlogo.cn/mmbiz/IySKyVze1WPsg8I1A2ZahvzIc4qxQibnvDD3jy50ZkbBBXibHXVQJUMZTUmbapl3LVibG8xoUfeG0IUSBWDrScFBQ/0?wx_fmt=jpeg";

new Image(null, '1', imageUrl, new Date())
	.insert(() => {
		console.log('inserted');
	});