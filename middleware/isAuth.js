require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async (req, res, next) => {
	const token = req.headers['authorization'];
	// const token = req.get('Authorization').split(' ')[1];
	if (!token) {
		res.status(422).json({ message: 'no token access' });
	}
	try {
		// console.log(token);
		const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
		// console.log(decoded, 'jjjj');
		req.userId = decoded;
		const user = await User.findByPk(req.userId);
		req.user = user;

		next();
	} catch (error) {
		res.status(422).json({ message: 'token is not valid' });
	}
};
