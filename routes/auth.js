const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const isRequested = require('../middleware/isRequested');
////// upload files ///////////
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/doctorFiles');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});
const fileFilter = (req, file, cb) => {
	// console.log(file.originalname);
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
		cb(null, true);
	} else cb(null, false);
};
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});
////// end upload files ///////////
router.post('/signup', authController.signUp);
router.post('/acceptUser', authController.acceptUser);
router.post('/login', authController.login);

router.post('/resetPassword', authController.resetPassword);
router.post('/setNewPassword', authController.setNewPassword);

router.post(
	'/upgradeRequest',
	isAuth,
	isRequested,
	upload.fields([
		{ name: 'doctorCv', maxCount: 1 },
		{ name: 'doctorFile', maxCount: 1 },
		{ name: 'doctorImage', maxCount: 1 }
	]),
	authController.upgradeRequest
);

router.put('/upgradeUserToDoctor/:id', isAuth, isAdmin, authController.upgradeUserToDoctor);
module.exports = router;
