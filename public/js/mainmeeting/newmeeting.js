/** @format */
const shareScreen = document.querySelector('#shareScreen');
const videoContainer = document.querySelector('#allUser');
const shareContainer = document.querySelector('#shareContainer');
const mainVideo = document.querySelector('#mainVideo');
const whiteBoardBtn = document.querySelector('#whiteBoard');
const whiteBoardContainer = document.querySelector('#whiteBoardContainer');
// const userVideo = document.querySelector('.uservideo')
const logedInUser = document.querySelector('#logedInUser');
const audioControl = document.querySelector('#audioControl');
const videoControl = document.querySelector('#videoControl');
const muteAll = document.querySelector('#muteAll');

var localStream;
var localStreamId;

//init connection
var connection = new RTCMultiConnection();
connection.socketURL = '/';
//connection extra data
connection.extra = {
	username: logedInUser.innerText,
	raiseHand: false,
	isAudioMuted: false,
	isVideoMuted: false,
	img: document.querySelector('#profileImg').src,
};
//joining room
socket.emit('join-room', ROOM_ID);

//connection settings
connection.sdpConstraints.mandatory = {
	OfferToRecieveAudio: true,
	OfferToRecieveVideo: true,
};

//setting audio and video
var bitrates = 512;
var resolutions = 'Ultra-HD';
var videoConstraints = {};

if (resolutions == 'HD') {
	videoConstraints = {
		width: {
			ideal: 1280,
		},
		height: {
			ideal: 720,
		},
		frameRate: 30,
	};
}

if (resolutions == 'Ultra-HD') {
	videoConstraints = {
		width: {
			ideal: 1920,
		},
		height: {
			ideal: 1080,
		},
		frameRate: 30,
	};
}
//detect if there is mice or webcam
connection.DetectRTC.load(function () {
	if (connection.DetectRTC.hasMicrophone === true) {
		// enable microphone
		connection.mediaConstraints.audio = true;
		connection.session.audio = {
			mandatory: {
				echoCancellation: false,
				googAutoGainControl: true,
				googNoiseSuppression: true,
				googHighpassFilter: true,
				googTypingNoiseDetection: true,
			},
		};
	} else {
		connection.mediaConstraints.audio = false;
		connection.session.audio = false;
	}

	if (connection.DetectRTC.hasWebcam === true) {
		// enable camera
		connection.mediaConstraints.video = videoConstraints;
		connection.session.video = true;
	} else {
		connection.mediaConstraints.video = false;
		connection.session.video = false;
	}

	if (connection.DetectRTC.hasMicrophone === false && connection.DetectRTC.hasWebcam === false) {
		// he do not have microphone or camera
		// so, ignore capturing his devices
		connection.dontCaptureUserMedia = true;
	}
});

var CodecsHandler = connection.CodecsHandler;

connection.processSdp = function (sdp) {
	var codecs = 'vp8';

	if (codecs.length) {
		sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
	}

	if (resolutions == 'HD') {
		sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
			audio: 128,
			video: bitrates,
			screen: bitrates,
		});

		sdp = CodecsHandler.setVideoBitrates(sdp, {
			min: bitrates * 8 * 1024,
			max: bitrates * 8 * 1024,
		});
	}

	if (resolutions == 'Ultra-HD') {
		sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
			audio: 128,
			video: bitrates,
			screen: bitrates,
		});

		sdp = CodecsHandler.setVideoBitrates(sdp, {
			min: bitrates * 8 * 1024,
			max: bitrates * 8 * 1024,
		});
	}

	return sdp;
};

//set ice servers (stun and turn)
connection.iceServers = [
	{
		urls: [
			'stun:stun.l.google.com:19302',
			'stun:stun1.l.google.com:19302',
			'stun:stun2.l.google.com:19302',
			'stun:stun.l.google.com:19302?transport=udp',
		],
	},
];

//setting screen container
connection.videosContainer = videoContainer;
//start getting streams
allStreams = [];
connection.onstream = (event) => {
	var existing = document.getElementById(event.streamid);
	if (existing && existing.parentNode) {
		existing.parentNode.removeChild(existing);
		event.mediaElement.removeAttribute('src');
		event.mediaElement.removeAttribute('srcObject');
		event.mediaElement.muted = true;
		event.mediaElement.volume = 0;
	}
	var video = document.createElement('video');
	try {
		video.setAttributeNode(document.createAttribute('autoplay'));
		video.setAttributeNode(document.createAttribute('playsinline'));
	} catch (e) {
		video.setAttribute('autoplay', true);
		video.setAttribute('playsinline', true);
	}

	if (event.type === 'local') {
		localStream = event.stream;
		video.volume = 0;
		try {
			video.setAttributeNode(document.createAttribute('muted'));
		} catch (e) {
			video.setAttribute('muted', true);
		}
	}
	video.srcObject = event.stream;
	allStreams.push(video.srcObject);
	connection.videosContainer.appendChild(video);
	setTimeout(function () {
		video.play();
	}, 5000);

	video.id = event.streamid;
	localStreamId = event.streamid;
	video.addEventListener('click', (e) => {
		mainVideo.style.display = '';
		whiteBoardContainer.style.display = 'none';
		mainVideo.srcObject = e.target.srcObject;
		mainVideo.setAttribute('height', '80vh');
		// userGrid.removeChild(e.target)
		recorder.resetVideoStreams([video.srcObject]);
	});
	// to keep room-id in cache
	localStorage.setItem(connection.socketMessageEvent, connection.sessionid);
};
//remove offline user's videos
connection.onstreamended = function (event) {
	var video = document.getElementById(event.streamid);
	if (video && video.parentNode) {
		video.parentNode.removeChild(video);
	}
};

connection.checkPresence(ROOM_ID, (isRoomExist, ROOM_ID) => {
	if (isRoomExist === true) {
		connection.join(ROOM_ID);
	} else {
		connection.open(ROOM_ID);
	}
});
