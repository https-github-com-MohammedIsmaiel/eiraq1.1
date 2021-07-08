/** @format */

const MeetingInfoModel = require('../models/meetingInfo.model');
const folderfileinfo = require('../models/folderfileinfo.model');
var path = require('path')
const GoogleDrive = require('../models/googleDrive');
const googleDrive = new GoogleDrive();
const chatmodel = require('../models/chat.model');



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
	const user_id=req.session.userId	;
	MeetingInfoModel.SaveMeetingInfo(
		meetingId,
		hostname,
		password,
		meeting_url,
		user_id
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
	MeetingInfoModel.checkId(req.params.room).then((obj) => {
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
exports.getRoomByPassword= (req, res) => {
	const clientpassword = req.body.meetingpassword;
	if (validationResult(req).isEmpty()) {
		MeetingInfoModel.checkMeetingIdByPassword(clientpassword)
			.then((obj) => {
				const meetingid=obj.meetingid;
				res.redirect(`/meeting/${meetingid}`);
			})
			.catch((err) => {
				console.log(err)
				req.flash('authError', err);
				res.redirect('/profile');
			});
	} else {
		req.flash('validationRoomErrors', validationResult(req).array());
		res.redirect('/profile');
	}
};
exports.getBackToMeeting = (req, res, next) => {
	res.redirect('/');
};
exports.getBackToProfile = (req, res, next) => {
	res.redirect('/profile');
};

exports.getScedule = (req, res) => {
	res.render('scedule');
	res.end();
};
exports.getChat = (req, res) => {
	accountsModel.getAllAccounts()
            .then((result) => {
               
				res.render('chat',{
					result:result,
					user_id: req.session.userId,	
				});
                res.end();
            })
            .catch(err => {
                res.redirect("/profile");
            });
};
exports.getMessages = (req, res) => {
	var receiver_id = req.params.receiver_id;
	var sender_id = req.session.userId;
	chatmodel.getAllMessages(sender_id,receiver_id)
            .then((result1) => {
				accountsModel.getAllAccounts()
				.then((result2) => { 
					res.render('chat',{
						result:result2,
						messages:result1,
						user_id: req.session.userId	
					});
				})
            })
            .catch(err => {
				console.log(err)
                res.redirect("/chat");
            });
};

exports.getData = (req, res) => {
	folderfileinfo.getAllFolders().then((result1) => {
		folderfileinfo.getAllGeneralFiles().then((result2) => {
			res.render('files/createfolder', {
				folders: result1,
				files:result2,
				user_id: req.session.userId	
			});
		}).catch(err => console.log(err));
	
	}).catch(err => console.log(err));
};

exports.createFolder = (req, res) => {
	const foldername = req.body.foldername;
	const user_id = req.session.userId;
	folderfileinfo.SaveFolderInfo(
		foldername,
		user_id
	).then(() => {
		res.redirect(`/profile/folders`);
		res.end();
	});
};

exports.showFiles = (req, res) => {
	const folderid = req.query.folderid;
	const foldername = req.query.folderName;
	folderfileinfo.getAllFiles(
		folderid
	).then((result) => {
	    res.render('files/uploadfiles',{
			files: result,
			folderid:folderid,
			foldername:foldername,
			user_id: req.session.userId
		})
	
	}).catch(err => console.log(err));
};
exports.createFiles = (req, res, next) => {
	const filename = req.file.fileName;
    var filetype = path.extname(filename);
	const folderid = req.body.folderid;
	const foldername = req.body.foldername;
	const fileid = req.file.fileId;
	const user_id = req.session.userId;
  googleDrive.generatePublicUrl(fileid).then(link => {
	  const webViewLink = link.webViewLink;
	  folderfileinfo.SaveFileInfo(
		filename,
		fileid,
		webViewLink,
		filetype,
		user_id,
		folderid
	).then(() => {
		res.redirect('/profile/folders/files?folderName='+foldername+'&folderid='+folderid);
		res.end();
	}).catch(err => console.log(err));
	})

};

exports.createGeneralFiles = (req, res, next) => {
	const filename = req.file.fileName;
    var filetype = path.extname(filename);
	const fileid = req.file.fileId;
	const user_id = req.session.userId;
  googleDrive.generatePublicUrl(fileid).then(link => {
	  const webViewLink = link.webViewLink;
	  folderfileinfo.SaveGeneralFileInfo(
		filename,
		fileid,
		webViewLink,
		filetype,
		user_id,
	).then(() => {
		res.redirect('/profile/folders');
		res.end();
	}).catch(err => console.log(err));
	})

};
exports.deleteFolder = (req, res, next) => {
	const folderid = req.params.folderid;
	folderfileinfo.getAllFiles(
		folderid
	).then((result) => {
		if(result.length>0){
		result.forEach(function(element) 
		{ 
			googleDrive.Deletefile(element.fileid).then(() => {
			
			}).catch(err => console.log(err));
			
		
		});
	  }
	
	}).then(()=>{
		folderfileinfo.deleteFolderWithFiles(
			folderid
		).then(() => {
			res.redirect('/profile/folders');
		})
	
	}).catch(err => console.log(err));
	
};

exports.deleteFile = (req, res, next) => {
	const folderid = req.params.folderid;
	const foldername = req.params.foldername;
	const fileid = req.params.fileid;
	const filedriveid = req.params.driveid;
	googleDrive.Deletefile(filedriveid ).then(() => {
		folderfileinfo.deleteFile(
			fileid
		).then(() => {
			res.redirect('/profile/folders/files?folderName='+foldername+'&folderid='+folderid); 
		
		}).catch(err => console.log(err));
	
	}).catch(err => console.log(err));
	

};
exports.deleteGeneralFile = (req, res, next) => {
	const fileid = req.params.fileid;
	const filedriveid = req.params.driveid;
	googleDrive.Deletefile(filedriveid ).then(() => {
		folderfileinfo.deleteFile(
			fileid
		).then(() => {
			res.redirect('/profile/folders'); 
		
		}).catch(err => console.log(err));
	
	}).catch(err => console.log(err));
	

};

exports.returnToFolders = (req, res, next) => {
	
			res.redirect('/profile/folders'); 
	
};

exports.returnToProfile = (req, res, next) => {
	
	res.redirect('/profile'); 

};