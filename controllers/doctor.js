const moment = require('moment');

const DoctorInfo = require('../models/doctor/doctorInfo');
const Love = require('../models/doctor/lovedForDoctor');
const AppointmentDate = require('../models/doctor/appointmentDate');
const DoctorFreeTime = require('../models/doctor/doctorFreeTime');
const User = require('../models/user');

const { Op } = require('sequelize');

const getAllcurrentDayInAllMonthInYear = (day) => {
	const date = new Date();
	const thisYear = date.getFullYear();
	const days = [];
	while (date.getMonth() <= 11 && date.getFullYear() == thisYear) {
		if (date.getDay() == day) days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
};

exports.addDoctorFreeTime = async (req, res, next) => {
	const freeTime = req.body.freeTime;
	const userId = req.userId;
	try {
		const doctorInfo = await DoctorInfo.findOne({ where: { userId } });
		freeTime.forEach(async (time) => {
			const allDays = getAllcurrentDayInAllMonthInYear(time.day);
			allDays.forEach(async (day) => {
				await doctorInfo.createDoctorFreeTime({
					day: moment(day).format('ddd MM DD yy'),
					fromHour: time.fromHour,
					toHour: time.toHour,
					userId
				});
			});
		});
		res.status(201).json({ message: 'Free Time is added' });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.showAllDoctors = async (req, res, next) => {
	try {
		const doctors = await DoctorInfo.findAll({
			attributes: [ 'id', 'doctorImage', 'specialist', 'experienceYears', 'price', 'loves', 'userId' ]
		});
		res.status(201).json(doctors);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.showDetailsforDoctor = async (req, res, next) => {
	const userId = req.params.id;
	try {
		const doctor = await DoctorInfo.findOne({
			where: { userId },
			attributes: [ 'id', 'doctorImage', 'specialist', 'experienceYears', 'price', 'loves' ]
		});
		const currentFreeTime = [];
		const doctorFreeTime = await DoctorFreeTime.findAll({ where: { userId } });
		doctorFreeTime.forEach(async (time) => {
			let hoursTaken = [];
			let hoursFree = [];
			let from = time.fromHour;
			let to = time.toHour;
			if (time.expectHours !== null) {
				hoursTaken = time.expectHours.split(' ');
				hoursTaken = hoursTaken.map((hour) => parseInt(hour));
				for (let i = from; i < to; i++) {
					if (!hoursTaken.includes(i)) hoursFree.push(i);
				}
				if (hoursFree.length !== 0) currentFreeTime.push({ day: time.day, hoursFree: hoursFree });
			} else {
				while (from !== to) {
					hoursFree.push(from);
					from = from + 1;
				}
				currentFreeTime.push({ day: time.day, hoursFree: hoursFree });
			}
		});
		res.status(201).json({ doctor: doctor, currentFreeTime: currentFreeTime });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.BookYourDate = async (req, res, next) => {
	const { hour, day, doctorId } = req.body;
	const userId = req.userId;
	try {
		const doctorInfo = await DoctorInfo.findByPk(doctorId);
		const docFreeTime = await DoctorFreeTime.findOne({
			where: { [Op.and]: { doctorInfoId: doctorId, day: { [Op.eq]: day } } }
		});
		if (docFreeTime.expectHours !== null) docFreeTime.expectHours = docFreeTime.expectHours + ' ' + hour;
		else docFreeTime.expectHours = '' + hour;
		docFreeTime.save();
		doctorInfo.createAppointmentDate({
			day: day,
			hour: hour,
			userId
		});
		res.status(201).json({ message: 'appointment is added ', doctorUserId: doctorInfo.userId });
	} catch (error) {
		res.status(500).json(error);
	}
};
//////////
exports.LovedOrNot = async (req, res, next) => {
	const DoctorId = req.body.id;
	const doctor = await DoctorInfo.findByPk(DoctorId);
	try {
		let love = await Love.findOne({
			where: { [Op.and]: [ { doctorInfoId: DoctorId }, { userId: req.userId } ] }
		});
		if (!love) {
			let newLike = await Love.create({
				userId: req.userId,
				doctorInfoId: DoctorId
			});
			const numberOfLoves = await Love.findAll({ where: { doctorInfoId: DoctorId } });
			doctor.loves = numberOfLoves.length;
			doctor.save();
			res.status(201).json({ message: 'Like...' });
		} else {
			await love.destroy();
			const numberOfLoves = await Love.findAll({ where: { doctorInfoId: DoctorId } });
			doctor.loves = numberOfLoves.length;
			doctor.save();
			res.status(201).json({ message: 'disLike..' });
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getAppoiForDoctor = async (req, res, next) => {
	const userId = req.userId;
	try {
		const doctorInfo = await DoctorInfo.findOne({ where: { userId } });
		const allAppointment = await AppointmentDate.findAll({
			where: { doctorInfoId: doctorInfo.id },
			attributes: [ 'id', 'day', 'hour' ],
			order: [ [ 'day', 'ASC' ], [ 'hour', 'ASC' ] ],
			include: [
				{
					model: User,
					attributes: [ 'id', 'name', 'imageUrl' ]
				}
			]
		});
		res.status(200).json(allAppointment);
	} catch (error) {
		res.status(500).json(error);
	}
};
// var { DoctorId, timeDate, DurationDate, hourDate } = req.body;
// const time = hourDate;
// const [ h, m, s ] = time.split(':');
// const ms = new Date().setHours(h, m, s);
// hourDate = new Date(ms);
// timeDate = new Date(timeDate);
// console.log(timeDate);
// const newDate = await AppointmentDate.create({
// 	doctorInfoId: DoctorId,
// 	userId: req.userId,
// 	timeDate: timeDate,
// 	durationDate: DurationDate,
// 	hourDate: hourDate
// });
// res.json('bocking DONE....');

// show details
////////////////////////////////////////////////////
// const dates = await AppointmentDate.findAll({ where: { doctorInfoId: doctorId } });
// show all dates for doctor
// const days = doctor.days;
// const from = doctor.from;
// const to = doctor.to;
// days.forEach((day) => {});
