const express = require('express');
const app = express();

const cors = require('cors');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const chatRoute = require('./routes/chat');
const doctorRoute = require('./routes/doctor');

const sequelize = require('./util/database');

const User = require('./models/user');
const Post = require('./models/post/post');
const PostImage = require('./models/post/postImage');
const PostComment = require('./models/post/postComment');
const Like = require('./models/post/like');
const CommentReply = require('./models/post/commentReply');

const Love = require('./models/doctor/lovedForDoctor');
const AppointmentDate = require('./models/doctor/appointmentDate');
const DoctorFreeTime = require('./models/doctor/doctorFreeTime');
const DoctorInfo = require('./models/doctor/doctorInfo');

const Chat = require('./models/chat/chat');
const userChats = require('./models/chat/userChats');
const TextMessage = require('./models/chat/textMessage');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoute);
app.use('/post', postsRoute);
app.use('/chat', chatRoute);
app.use('/doctor', doctorRoute);

User.hasOne(DoctorInfo);
DoctorInfo.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(PostImage);
Post.hasMany(PostComment);
User.hasMany(PostComment);
User.hasMany(PostImage);

PostComment.belongsTo(User);

PostImage.belongsTo(Post);
PostComment.belongsTo(Post);

User.hasMany(Like);
Post.hasMany(Like);
Like.belongsTo(User);
Like.belongsTo(Post);

User.hasMany(Love);
DoctorInfo.hasMany(Love);
Love.belongsTo(User);
Love.belongsTo(DoctorInfo);

User.hasMany(AppointmentDate);
User.hasMany(DoctorFreeTime);
DoctorFreeTime.belongsTo(User);
AppointmentDate.belongsTo(User);
DoctorInfo.hasMany(DoctorFreeTime);
DoctorFreeTime.belongsTo(DoctorInfo);

DoctorInfo.hasMany(AppointmentDate);
AppointmentDate.belongsTo(DoctorInfo);

// User.hasMany(DateForUser);
// DoctorInfo.hasMany(DateForUser);
// DateForUser.belongsTo(User);
// DateForUser.belongsTo(DoctorInfo);

User.hasMany(CommentReply);
CommentReply.belongsTo(User);

PostComment.hasMany(CommentReply);
CommentReply.belongsTo(PostComment);

User.belongsToMany(Chat, { through: 'User_Chat' });
Chat.belongsToMany(User, { through: 'User_Chat' });

Chat.hasMany(TextMessage);
TextMessage.belongsTo(Chat);
app.get('/', (req, res, next) => {
	res.send('hello from da3moon');
});
sequelize
	.sync()
	.then((result) => {
		// console.log(result);
		app.listen(3000, () => {
			console.log('heeeeey again on 3000');
		});
	})
	.catch((err) => {
		console.log(err);
	});
