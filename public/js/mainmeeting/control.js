/** @format */

//screen sharing
if (shareScreen !== null) {
	shareScreen.addEventListener('click', () => {
		connection.addStream({
			screen: true,
			oneway: true,
		});
	});
}
//mute and unmute
audioControl.addEventListener('click', (e) => {
	let firstLocalStream = connection.streamEvents.selectFirst({
		local: true,
	}).stream;
	if (connection.extra.isAudioMuted === false) {
		connection.extra.isAudioMuted = true;
		firstLocalStream.mute('audio');
		audioControl.innerHTML = `<i style = "color:#ff6a00;" class=" fas fa-microphone-slash"></i>`;
	} else {
		connection.extra.isAudioMuted = false;
		firstLocalStream.unmute('audio');
		audioControl.innerHTML = `<i class=" fas fa-microphone"></i>`;
		connection.streamEvents.selectFirst('local').mediaElement.muted = true;
		//uncomment this when using different devices
		navigator.getUserMedia =
			navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
		navigator.getUserMedia(
			{ audio: true },
			function (audioStream) {
				connection.attachStreams[0].addTrack(audioStream.getAudioTracks()[0]); // enable audio again
				connection.renegotiate(); // share again with all users
			},
			function () {},
		);
	}
	connection.updateExtraData();
	renderUsers();
});

videoControl.addEventListener('click', (e) => {
	let firstLocalStream = connection.streamEvents.selectFirst({
		local: true,
	}).stream;
	if (connection.extra.isVideoMuted === false) {
		connection.extra.isVideoMuted = true;
		firstLocalStream.mute('video');
		videoControl.innerHTML = `<i style = "color: #ff6a00;" class="fas fa-video-slash"></i>`;
	} else {
		connection.extra.isVideoMuted = false;
		firstLocalStream.unmute('video');
		videoControl.innerHTML = `<i class="fas fa-video"></i>`;
	}
	connection.updateExtraData();
	renderUsers();
});
//handle on mute
connection.onunmute = function (e) {};
//handle on mute
connection.onmute = function (e) {};

//mute all
muteAll.addEventListener('click', () => {
	socket.emit('renderMuteAll');
});

socket.on('renderMuteAll', () => {
	if (connection.extra.isAudioMuted === true) {
		return;
	} else {
		audioControl.click();
	}
});

whiteBoardBtn.addEventListener('click', () => {
	mainVideo.style.display = 'none';
	whiteBoardContainer.style.display = '';
});
//admin permision
const allowShare = document.querySelector('#allowShare');
const allowChat = document.querySelector('#allowChat');
let canShare = false;
let canChat = false;
if (connection.isInitiator) {
	canShare = true;
	canChat = true;
}
allowChat.addEventListener('click', () => {
	socket.emit('disallowChat');
});
allowShare.addEventListener('click', () => {
	socket.emit('disallowShare');
});
socket.on('disallowShare', () => {
	shareScreen.style.display = '';
});
socket.on('disallowChat', () => {
	msg.style.display = '';
});
