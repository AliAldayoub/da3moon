const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const isAuth = require('../middleware/isAuth');
const isDoctor = require('../middleware/isDoctor');

////// upload files ///////////
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/postImages');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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

//add post
router.post('/addPost', isAuth, isDoctor, upload.array('postImages', 10), postsController.addPost);

//get all posts
router.get('/getAllPost', isAuth, postsController.getAllPost);

//update post
router.put('/updatePost/:id', isAuth, isDoctor, upload.array('postImages', 10), postsController.updatePost);

//delete post
router.delete('/deletePost/:id', isAuth, isDoctor, postsController.deletePost);

//like && unlike post
router.post('/like', isAuth, postsController.likeOrDislike);

//comment on post
router.post('/addComment', isAuth, postsController.addComment);

//get all comments on post
router.get('/getAllComments/:id', isAuth, postsController.getAllComments);
module.exports = router;

//reply on comment
router.post('/addReply', isAuth, isDoctor, postsController.addReply);
