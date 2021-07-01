
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const path = require('path');
const profileController = require('../controllers/profile.controller');
const router = require('express').Router();
const { google } = require('googleapis');
const CLIENT_ID = '985573331622-9mddg0qss828jtavbervj05akm4ah38i.apps.googleusercontent.com';
const CLIENT_SECRET = 'k3qlwPGczaPnlK3hGvJV-Emz';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04j8Y28dmaQ2XCgYIARAAGAQSNwF-L9Ir644owAq35q-BXXbkTgGXpiGUdUfNmI_0Tij950GJBSacr0hh6c6UucKFFwjtrj-wzXI';




    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
      
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
      const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
      });
    
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
router.get('/chat', profileController.getChat);

router.get('/returnback', profileController.getBackToMeeting);
router.get('/exitchat', profileController.getBackToProfile);

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