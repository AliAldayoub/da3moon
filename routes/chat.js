const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const isAuth = require('../middleware/isAuth');
const isDoctor = require('../middleware/isDoctor');
const isAdmin = require('../middleware/isAdmin');
//router.get('/',chatController.getHello)

router.post('/createChat', isAuth, chatController.createChat);

router.get('/getChat', isAuth, chatController.getChat);

router.get('/getAllChat', isAuth, chatController.getAllChat);

module.exports = router;
