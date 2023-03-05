module.exports = async (req, res, next) => {
	try {
		const user = req.user;
		if (user.status <= 1) {
			return res.status(403).json({ message: 'you are not allowed to add post ,you are not a doctor' });
		}
		next();
	} catch (error) {
		res.status(500).json(error);
	}
};
