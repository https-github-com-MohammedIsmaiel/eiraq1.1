const router = require('express').Router();
const roomController = require('../controllers/room.controller');

router.get('/leavemeeting', roomController.destroyMeeting);
router.post('/upload', roomController.uploadFile);
router.get('/leave', roomController.leave);
module.exports = router;
