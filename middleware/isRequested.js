const DoctorInfo = require('../models/doctor/doctorInfo');
module.exports = async (req, res, next) => {
	try {
		const userId = req.userId;
		const doctorInfoExist = await DoctorInfo.findOne({ where: { userId } }).catch((err) => {
			console.log('rr');
		});
		if (doctorInfoExist) {
			return res
				.status(403)
				.json({ message: 'your request is already added before, wait until accept or Ignore' });
		}
		next();
	} catch (error) {
		res.status(500).json(error);
	}
};
