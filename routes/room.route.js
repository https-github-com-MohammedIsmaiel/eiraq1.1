const router = require('express').Router();
const roomController = require('../controllers/room.controller');

router.get('/leavemeeting', roomController.destroyMeeting);
router.post('/upload', roomController.uploadFile);

module.exports = router;
