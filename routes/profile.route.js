
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const path = require('path');
const profileController = require('../controllers/profile.controller');
const router = require('express').Router();
    var {google} = require('googleapis');  
    // const CLIENT_ID = '1084641653805-a0rs75vjsoi3a0rnru20n7dedcqeaqd3.apps.googleusercontent.com';
    // const CLIENT_SECRET = 'APmWb_R_7FG8ngIxl7aAvS8C';
    // const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    // // const REDIRECT_URI = 'https://www.googleapis.com/oauth2/v4/token';
    
    // const REFRESH_TOKEN = '1//04Ls2TxaYQs6zCgYIARAAGAQSNwF-L9IrCs-x7_BVNC1kmEm_NXZdzDcbnmSZbhdlEIYNTmH9U0D-4eKTnicW1i0r0Ip4qG8UQFQ';
     const CLIENT_ID = '692931569990-oooug8lf21adthgnlklsvj4l2083i5l4.apps.googleusercontent.com';
    const CLIENT_SECRET = 'UZw-YIDmzEMe08VupfcMKQah';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    // const REDIRECT_URI = 'https://www.googleapis.com/oauth2/v4/token';
    
    const REFRESH_TOKEN = '1//04hn0IIe5aBQoCgYIARAAGAQSNwF-L9IrldYPDQOFfLD50irUYkISCBMQ3ucuBk4iuxnrPHPlcFsOQXCcvBVF-fUNqyhAezlSbbU';
    
    // {
    //   "access_token": "ya29.a0AfH6SMCCOkG97HdWEuQsSZ_nTju73hqrOnpDZRksGw0_69iLZBYZP84CQLSvdzdZQk5HndTvKHiDc82MIbke5eblq0UoNOgIHlqRozap3EMGLD4ZLV0sT32n43dyxO0sg5t9LoIYhD4PtUhEkuJZjeBIujL7", 
    //   "scope": "https://www.googleapis.com/auth/drive", 
    //   "token_type": "Bearer", 
    //   "expires_in": 3599, 
    //   "refresh_token": "1//04hn0IIe5aBQoCgYIARAAGAQSNwF-L9IrldYPDQOFfLD50irUYkISCBMQ3ucuBk4iuxnrPHPlcFsOQXCcvBVF-fUNqyhAezlSbbU"
    // }
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
      

    );
    
    // const url = oauth2Client.generateAuthUrl({
    //   // 'online' (default) or 'offline' (gets refresh_token)
    //   access_type: 'offline',
    
    //   // If you only need one scope you can pass it as a string
    //   scope: 'https://www.googleapis.com/oauth2/v4/token'
    // });
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