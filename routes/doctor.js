const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor');
const isAuth = require('../middleware/isAuth');
const isDoctor = require('../middleware/isDoctor');

router.post('/addDoctorFreeTime', isAuth, isDoctor, doctorController.addDoctorFreeTime);

router.get('/showAllDoctors', isAuth, doctorController.showAllDoctors);

router.get('/showDetailsForDoctor/:id', isAuth, doctorController.showDetailsforDoctor);

router.post('/BookYourDate', isAuth, doctorController.BookYourDate);

router.get('/getAppoiForDoctor', isAuth, doctorController.getAppoiForDoctor);

router.post('/LovedOrNot', isAuth, doctorController.LovedOrNot);
module.exports = router;
