/** @format */

const MeetingInfoModel = require('../models/meetingInfo.model');

const validationResult = require('express-validator').validationResult;
const accountsModel = require('../models/accounts.model');
// generate random password
let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateRandomPassword = () => {
	let i,
		randomPassword = '';
	for (i = 0; i < 6; i++) {
		randomPassword =
			randomPassword +
			chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return randomPassword;
};
const password = generateRandomPassword();
const { v4: uuidv4 } = require('uuid');

exports.createNewMeeting = (req, res, next) => {
	const hostname = req.session.loggedinuser;
	const password = generateRandomPassword();
	const meetingId = uuidv4();
	const meeting_url = `/meeting/${meetingId}`;

	MeetingInfoModel.SaveMeetingInfo(
		meetingId,
		hostname,
		password,
		meeting_url,
	).then(() => {
		req.session.meetingid = meetingId;
		req.session.meetingcreater = true;
		res.redirect(`/meeting/${meetingId}`);
		res.end();
	});
};

exports.geVideoRoom = (req, res) => {
	if (!req.session.loggedinuser) {
		return res.redirect('/joinmeeting?meetingid=' + req.params.room);
	}
	console.log(req.params.room)
	MeetingInfoModel.checkId(req.params.room).then((obj) => {
		// console.log(req.params.room);
		obj.meetingurl = req.headers.host + obj.meetingurl;
		res.render('room', {
			roomid: req.params.room,
			meetinginfo: obj,
			loggedinuser: req.session.loggedinuser,
			pro_img: req.session.profileimg,
			isHost: req.session.meetingcreater
		});
	}).catch(err => res.end());
};
exports.getProfileImage = (req, res) => {
	if (validationResult(req).isEmpty()) {
		var file = req.file;
		var img_name = req.file.originalname;

		accountsModel
			.saveImageUrl(req.session.loggedinEmail, img_name)
			.then(() => {
				req.session.profileimg = img_name;
				res.redirect('/profile');

				res.end();
			});
	} else {
		req.flash('validationErrors', validationResult(req).array());
		res.redirect('/profile');
	}
};
exports.getRoom = (req, res) => {
	const clientpassword = req.body.meetingpassword;
	if (validationResult(req).isEmpty()) {
		MeetingInfoModel.checkMeetingPassword(clientpassword)
			.then(() => {
				if (!req.session.loggedinuser) {
					req.session.loggedinuser = req.body.clientname;
				}
				res.redirect(`/meeting/${clientpassword}`);
			})
			.catch((err) => {
				req.flash('authError', err);
				res.redirect('/joinmeeting?meetingpassword=' + clientpassword);
			});
	} else {
		req.flash('validationErrors', validationResult(req).array());
		res.redirect('/joinmeeting?meetingpassword=' + clientpassword);
	}
};
exports.getBackToMeeting = (req, res, next) => {
	res.redirect('/');
};

exports.getScedule = (req, res) => {
	res.render('scedule');
	res.end();
};