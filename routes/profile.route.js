
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const path = require('path');
const profileController = require('../controllers/profile.controller');
const router = require('express').Router();
var connection_drive = require('../models/init_google_connection');
var drive=connection_drive();
var multer = require('multer')
var GoogleDriveStorage = require('multer-google-drive');
const storage = GoogleDriveStorage({
    drive: drive,
    parents: '1LbPAb15gF6Sct89m3x8zr8XvAZnz9XDj',
    fileName: function (req, file, cb) {
      let filename = `test-${file.originalname}`;
      cb(null, filename);
    }
  })
  
var upload = multer({
  storage: storage
})
 


const uploader = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "public/upload_images/");
      },
      filename: (req, file, cb) => {
          cb(null, file.originalname);
      }
  })
})

router.get("/newmeeting",  profileController.createNewMeeting);


router.get("/meeting/:room", profileController.geVideoRoom);

router.post(
	'/imageprofile',
	uploader.single('uploaded_image'),
	check('uploaded_image').custom((value, { req }) => {
		if (!req.file) {
			throw new Error('no file is uploaded!');
		}
		var img_name = req.file.originalname;
		var extension = path.extname(img_name).toLowerCase();

		if (
			extension == '.jpeg' ||
			extension == '.jpg' ||
			extension == '.png' ||
			extension == '.gif'
		) {
			return true;
		} else {
			throw new Error('Only image files are allowed!');
		}
	}),
	profileController.getProfileImage,
);

// when press join redirect me to meeting page
router.post("/roomvideo",bodyParser.urlencoded({ extended: true }),
check("meetingpassword")
    .not()
    .isEmpty()
    .withMessage("meetingpassword is required"),
check("username")
    .not()
    .isEmpty()
    .withMessage("your name is required")
    .isLength({ min: 6 })
    .withMessage("your name must be at least 6 charachters"),
	profileController.getRoomByPassword);

// when press cancel redirect me to profile page
router.get('/getmessages/exitchat', profileController.getBackToProfile);
router.get('/exitchat', profileController.getBackToProfile);


router.get('/chat', profileController.getChat);
// router.get('/getmessages/:receiver_id',profileController.getMessages)

router.get('/returnback', profileController.getBackToMeeting);

router.get('/schedule', profileController.getScedule);
router.get('/profile/folders', profileController.getData);
router.post('/createfolder',profileController.createFolder)
router.get('/profile/folders/files',profileController.showFiles)
router.post('/profile/folders/files/uploadFile', upload.single("file"),profileController.createFiles);
router.post('/profile/folders/uploadFile', upload.single("file"),profileController.createGeneralFiles);

router.get('/profile/folders/delete/:folderid',profileController.deleteFolder)
router.get('/profile/folders/files/delete/:fileid/:driveid/:folderid/:foldername',profileController.deleteFile)
router.get('/profile/folders/delete/:fileid/:driveid',profileController.deleteGeneralFile)
router.get('/profile/folders/files/return',profileController.returnToFolders)
router.get('/profile/folders/return',profileController.returnToProfile)


module.exports = router;