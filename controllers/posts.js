const User = require('../models/user');
const Post = require('../models/post/post');
const PostImage = require('../models/post/postImage');
const PostComment = require('../models/post/postComment');
const Like = require('../models/post/like');
const CommentReply = require('../models/post/commentReply');
const { Op } = require('sequelize');
const fs = require('fs');

exports.addPost = async (req, res, next) => {
	const desc = req.body.desc;
	const userId = req.userId;
	let postImages = [];
	if (req.files) {
		req.files.forEach((file) => {
			postImages.push(file.path);
		});
	}
	try {
		const user = await User.findByPk(req.userId);
		const post = await user.createPost({
			desc: desc
		});
		if (postImages) {
			postImages.forEach((image) => {
				post.createPostImage({
					image: image,
					userId
				});
			});
		}
		res.status(201).json({ message: 'post created' });
	} catch (error) {
		res.status(400).json(error);
	}
};

exports.getAllPost = async (req, res, next) => {
	try {
		const allPost = await User.findAll({
			attributes: [ 'id', 'name', 'createdAt', 'imageUrl' ],
			include: [
				{
					required: true,
					model: Post,
					attributes: [ 'id', 'desc', 'createdAt' ],
					include: [
						{
							model: PostImage,
							attributes: [ 'id', 'image' ]
						},
						{
							model: PostComment,
							attributes: [ 'id', 'comment', 'createdAt' ],
							include: [
								{
									model: User,
									attributes: [ 'id', 'name', 'imageUrl' ]
								},
								{
									model: CommentReply,
									attributes: [ 'id', 'reply', 'createdAt' ],
									include: [
										{
											model: User,
											attributes: [ 'id', 'name', 'imageUrl' ]
										}
									]
								}
							]
						}
					]
				}
			]
		});
		res.json(allPost);
	} catch (error) {
		return res.json(error);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.userId;
	try {
		const postImages = await PostImage.findAll({ where: { [Op.and]: { postId, userId } } });
		postImages.forEach((postImage) => {
			fs.unlinkSync(`./uploads/postImages/${postImage.image.split('\\')[2]}`);
		});
		await PostImage.destroy({
			where: { [Op.and]: { postId, userId } }
		});
		await PostComment.destroy({
			where: { [Op.and]: { postId, userId } }
		});
		await Post.destroy({
			where: { [Op.and]: { id: postId, userId } }
		});
		res.status(201).json({ message: 'deleting Done...' });
	} catch (error) {
		return res.status(401).json(error);
	}
};

exports.updatePost = async (req, res, next) => {
	const desc = req.body.desc;
	const postId = req.params.id;
	const userId = req.userId;
	let post;
	try {
		post = await Post.findByPk(postId);
		//delete all images//
		const postImages = await PostImage.findAll({ where: { [Op.and]: { postId, userId } } });
		if (postImages) {
			postImages.forEach((postImage) => {
				fs.unlinkSync(`./uploads/postImages/${postImage.image.split('\\')[2]}`);
			});
			await PostImage.destroy({
				where: { [Op.and]: { postId, userId } }
			});
		}
		post.desc = desc;
		await post.save();
		let reqPostImages = [];
		if (req.files) {
			req.files.forEach((file) => {
				reqPostImages.push(file.path);
			});
		}
		if (reqPostImages) {
			reqPostImages.forEach((image) => {
				post.createPostImage({
					image: image,
					userId
				});
			});
		}
		res.status(201).json({ message: 'post is updated' });
	} catch (error) {
		return res.status(401).json(error);
	}
};

exports.likeOrDislike = async (req, res, next) => {
	const postId = req.body.id;
	try {
		const post = await Post.findByPk(postId);
		if (!post) {
			return res.status(404).json({ message: 'post does not exist' });
		}
		let like = await Like.findOne({
			where: { [Op.and]: [ { postId: postId }, { userId: req.userId } ] }
		});
		if (!like) {
			let newLike = await Like.create({
				userId: req.userId,
				postId: postId
			});
			res.status(201).json({ message: 'Like...' });
		} else {
			await like.destroy();
			res.status(201).json({ message: 'disLike..' });
		}
	} catch (error) {
		res.status(201).json(error);
	}
};

exports.addComment = async (req, res, next) => {
	const { postId, comment } = req.body;
	const userId = req.userId;
	try {
		const post = await Post.findByPk(postId);
		post.createPostComment({
			comment: comment,
			userId: userId
		});
		res.status(201).json({ message: 'comment added' });
	} catch (error) {
		res.status(403).json(error);
	}
};

exports.getAllComments = async (req, res, next) => {
	const postId = req.params.id;
	try {
		const allComments = await PostComment.findAll({
			where: { postId },
			attributes: [ 'id', 'comment', 'createdAt' ],
			include: [
				{
					model: User,
					attributes: [ 'name', 'imageUrl' ]
				}
			]
		});
		res.status(200).json(allComments);
	} catch (error) {}
	res.status(200).json(error);
};

exports.addReply = async (req, res, next) => {
	const commentId = req.body.commentId;
	const userId = req.userId;
	const reply = req.body.reply;
	try {
		CommentReply.create({
			reply,
			userId,
			postCommentId: commentId
		});
		res.status(201).json({ message: 'reply added' });
	} catch (error) {
		res.status(401).json(error);
	}
};
