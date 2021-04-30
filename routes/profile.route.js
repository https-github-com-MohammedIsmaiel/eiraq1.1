const router = require('express').Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const path = require('path');
const profileController = require('../controllers/profile.controller');
const multer = require('multer')

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
router.get('/returnback', profileController.getBackToMeeting);

router.get('/schedule', profileController.getScedule);

module.exports = router;