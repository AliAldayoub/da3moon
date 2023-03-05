module.exports = async (req, res, next) => {
	try {
		const user = req.user;
		if (user.status !== 3) {
			return res.status(403).json({ message: 'you are not allowed to edit you need to be an admin' });
		}
		next();
	} catch (error) {
		res.status(500).json(error);
	}
};
