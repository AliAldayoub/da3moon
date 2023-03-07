const User = require('../models/user');
const DoctorInfo = require('../models/doctor/doctorInfo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const fs = require('fs');

require('dotenv').config();

exports.signUp = async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const userExist = await User.findOne({ where: { email } }).catch((err) => {
			console.log(err);
		});
		if (userExist) res.status(400).json({ message: 'user already exist' });
	} catch (error) {
		res.status(500).json(error);
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const numRandom = Math.ceil(Math.random() * 100000);

		const newUser = await User.create({
			name: name,
			email: email,
			password: hashedPassword
		});
		let mailTransporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'sip2-267.nexcess.net',
			port: 587,
			secure: false,
			auth: {
				user: 'fullaaudi@gmail.com',
				pass: 'nsrexwxoxezlkqao'
			}
		});

		let mailDetails = {
			from: 'fullaaudi@gmail.com',
			to: email,
			subject: 'Test mail',
			text: `${numRandom}`
		};

		mailTransporter.sendMail(mailDetails, function(err, data) {
			if (err) {
				console.log('Error Occurs');
			} else {
				console.log('Email sent successfully');
			}
		});
		res.status(201).json({ message: 'user created', code: numRandom, email });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.acceptUser = async (req, res, next) => {
	const email = req.body.email;
	try {
		const userExist = await User.findOne({ where: { email } }).catch((err) => {
			console.log(err);
		});

		userExist.status = 1;
		userExist.save();
		userId = userExist.id.toString();
		jwt.sign(userId, process.env.JWT_SECRET_KEY, (err, token) => {
			if (err) {
				console.log(err);
			}
			console.log(token);
			res.status(201).json({ message: 'user Accepted', token: token });
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.login = async (req, res, next) => {
	const email = req.body.email;
	try {
		const userExist = await User.findOne({ where: { email } }).catch((err) => {
			console.log(err);
		});
		if (!userExist) {
			res.status(403).json({ message: 'email is not exist' });
		}
		const password = req.body.password;
		const isPassTrue = await bcrypt.compare(password, userExist.password);
		userId = userExist.id.toString();

		if (!isPassTrue) {
			res.status(403).json({ message: 'password is not true' });
		}
		jwt.sign(userId, process.env.JWT_SECRET_KEY, (err, token) => {
			if (err) {
				console.log(err);
			}
			res.status(201).json({ message: 'user logged in', token: token });
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.resetPassword = async (req, res, next) => {
	const email = req.body.email;
	try {
		const userExist = await User.findOne({ where: { email } }).catch((err) => {
			console.log(err);
		});
		if (!userExist) {
			res.status(403).json({ message: 'email is not exist' });
		}
		const numRandom = Math.ceil(Math.random() * 100000);

		let mailTransporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'sip2-267.nexcess.net',
			port: 587,
			secure: false,
			auth: {
				user: 'fullaaudi@gmail.com',
				pass: 'nsrexwxoxezlkqao'
			}
		});

		let mailDetails = {
			from: 'fullaaudi@gmail.com',
			to: email,
			subject: 'Reset Password',
			text: `${numRandom}`
		};
		mailTransporter.sendMail(mailDetails, function(err, data) {
			if (err) {
				console.log('Error Occurs');
			} else {
				console.log('Email sent successfully');
			}
		});
		const userId = userExist.id;
		res.status(201).json({ message: 'code has sent to your email', code: numRandom, userId });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.setNewPassword = async (req, res, next) => {
	const { password, userId } = req.body;
	try {
		const user = await User.findByPk(userId);
		const hashedPassword = await bcrypt.hash(password, 12);
		user.password = hashedPassword;
		user.save();
		res.status(201).json({ message: 'password has updated' });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.upgradeRequest = async (req, res, next) => {
	const { specialist, experienceYears, price, phoneNumber, desc } = req.body;

	const doctorFile = req.files.doctorFile[0].path;
	const doctorCv = req.files.doctorCv[0].path;
	const doctorImage = req.files.doctorImage[0].path;

	const userId = req.userId;

	try {
		const user = await User.findByPk(userId);
		const doctorInfoExist = await DoctorInfo.findOne({ where: { userId } }).catch((err) => {
			console.log(err);
		});
		if (doctorInfoExist) {
			return res
				.status(403)
				.json({ message: 'your request is already added before wait until accept or Ignore' });
		}
		const userDoctorInfo = await user.createDoctorInfo({
			desc: desc,
			doctorFile: doctorFile,
			doctorCv: doctorCv,
			doctorImage: doctorImage,
			phoneNumber: phoneNumber,
			specialist: specialist,
			experienceYears: experienceYears,
			price: price
		});
		res
			.status(201)
			.json({ userDoctorInfo, message: 'your request has been added wait until admin accept or Ignore you' });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.upgradeUserToDoctor = async (req, res, next) => {
	const userId = req.params.id;
	try {
		const userToUpgrade = await User.findByPk(userId);
		userToUpgrade.status = 2;
		userToUpgrade.save();
		const doctorInfo = await DoctorInfo.findOne({ where: { userId } });
		fs.unlinkSync(`./uploads/doctorFiles/${doctorInfo.doctorCv.split('\\')[2]}`);
		fs.unlinkSync(`./uploads/doctorFiles/${doctorInfo.doctorFile.split('\\')[2]}`);
		res.status(201).json({ message: 'user now is a doctor' });
	} catch (error) {
		res.status(500).json(error);
	}
};
