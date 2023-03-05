const User = require('../models/user');
const Chat = require('../models/chat/chat');
const UserChats = require('../models/chat/userChats');
const { Op } = require('sequelize');

//create chat
exports.createChat = async (req, res, next) => {
	const senderId = req.userId;
	const reciverId = req.body.doctorUserId;
	try {
		const chat = await Chat.create({
			senderId,
			reciverId
		});
		const user = await User.findByPk(senderId);
		const user2 = await User.findByPk(reciverId);
		user.addChat(chat, { through: { selfGranted: false } });
		user2.addChat(chat, { through: { selfGranted: false } });
		res.status(201).json({ message: 'chat created!' });
	} catch (error) {
		res.status(500).json(error);
	}
};
//get all chats
exports.getAllChat = async (req, res, next) => {
	const userId = req.userId;
	const allChat = await User.findOne({ where: { id: userId }, include: Chat, attributes: [ 'id' ] });
	res.status(201).json(allChat);
};

// get chat with another user
exports.getChat = (req, res, next) => {
	const userId = req.userId;
	// const user = await User.findByPk(userId,{
	//     where:{}
	// });
};
// const chats = await Chat.findOne({
// 	include: [
// 		{
// 			model: Chat,
// 			include: User
// 		}
// 	]
// }).catch((err) => {
// 	res.status(403).json(err);
// });

// res.status(201).json(chats);
