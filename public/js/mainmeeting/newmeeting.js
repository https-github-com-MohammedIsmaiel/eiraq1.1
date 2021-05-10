/** @format */

const shareScreen = document.querySelector('#shareScreen');
const videoContainer = document.querySelector('#allUser');
const shareContainer = document.querySelector('#shareContainer');
const mainVideo = document.querySelector('#mainVideo');
const whiteBoardBtn = document.querySelector('#whiteBoard')
const whiteBoardContainer = document.querySelector('#whiteBoardContainer')
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
connection.session = {
    Audio: {
        mandatory: {
            echoCancellation: false,
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googTypingNoiseDetection: true,
        },
    },
    video: true,
    // data: true
    // screen:true
};
//connection extra data
connection.extra = {
    username: logedInUser.innerText,
    raiseHand: false,
    isAudioMuted: false,
    isVideoMuted: false,
    img: document.querySelector('#profileImg').src,
};
console.log(connection.extra.img);
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
// //detect if there is mice or webcam
// connection.DetectRTC.load(function () {
//     if (connection.DetectRTC.hasMicrophone === true) {
//         // enable microphone
//         connection.mediaConstraints.audio = true;
//         connection.session.audio = true;
//     }

//     if (connection.DetectRTC.hasWebcam === true) {
//         // enable camera
//         connection.mediaConstraints.video = true;
//         connection.session.video = true;
//     }

//     if (connection.DetectRTC.hasMicrophone === false &&
//         connection.DetectRTC.hasWebcam === false) {
//         // he do not have microphone or camera
//         // so, ignore capturing his devices
//         connection.dontCaptureUserMedia = true;
//     }
// })

connection.mediaConstraints = {
    video: videoConstraints,
    audio: true,
};

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
console.log(connection);
allStreams = [];
connection.onstream = (event) => {
    console.log('on stream');
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
    recorder.addStreams(event.stream);
    allStreams.push(event.stream);
    video.srcObject = event.stream;

    // var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
    // var mediaElement = getHTMLMediaElement(video, {
    //     title: event.userid,
    //     buttons: ['full-screen'],
    //     width: width,
    //     showOnMouseEnter: false
    // });

    connection.videosContainer.appendChild(video);

    setTimeout(function () {
        video.play();
    }, 5000);

    video.id = event.streamid;
    localStreamId = event.streamid;
    video.addEventListener('click', (e) => {
        console.log('clicked');
        mainVideo.style.display = ''
        whiteBoardContainer.style.display = 'none'
        mainVideo.srcObject = e.target.srcObject;
        mainVideo.setAttribute('height', '80vh');
        // userGrid.removeChild(e.target)
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
    console.log('hello');
    if (isRoomExist === true) {
        connection.join(ROOM_ID);
    } else {
        connection.open(ROOM_ID);
    }
});

//screen sharing
shareScreen.addEventListener('click', () => {
    connection.addStream({
        screen: true,
        oneway: true,
    });
});
//mute and unmute
audioControl.addEventListener('click', (e) => {
    let firstLocalStream = connection.streamEvents.selectFirst({
        local: true,
    }).stream;
    if (connection.extra.isAudioMuted === false) {
        // connection.streamEvents[connection.userid].stream.mute('audio');
        connection.extra.isAudioMuted = true;
        // localStream.mute('audio');
        // connection.streamEvents.selectFirst().mute('audio');
        firstLocalStream.mute('audio');
        audioControl.innerHTML = `<i style = "color:#ff6a00;" class=" fas fa-microphone-slash"></i>`;
    } else {
        connection.extra.isAudioMuted = false;
        // connection.streamEvents[connection.userid].stream.unmute('audio');
        // localStream.unmute('audio');
        // connection.streamEvents.selectFirst().unmute('audio');
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
            function () { },
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
        //uncomment this when using different devices
        // connection.attachStreams[0].getVideoTracks().forEach(function (track) {
        //     track.stop(); // turn off cam
        // });
    } else {
        connection.extra.isVideoMuted = false;
        firstLocalStream.unmute('video');
        videoControl.innerHTML = `<i class="fas fa-video"></i>`;
        //uncomment this when using different devices
        // navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        // navigator.getUserMedia({ video: true }, function (videoStream) {
        //     connection.attachStreams[0].addTrack(videoStream.getVideoTracks()[0]); // enable video again
        //     connection.renegotiate();  // share again with all users
        // }, function () { });
    }
    connection.updateExtraData();
    renderUsers();
});
//handle on mute
connection.onunmute = function (e) {
    // $(`#${localStreamId}`).poster = "/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBhSHCY3v0mocVZF2bOz-Qtd5cHojpbEc_g&usqp=CAU"
    // e.mediaElement.srcObject = null;
    // e.mediaElement.setAttribute('poster', connection.extra.img);
    // console.log('unmuting');
};
//handle on mute
connection.onmute = function (e) {
    // $(`#${localStreamId}`).poster = "/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBhSHCY3v0mocVZF2bOz-Qtd5cHojpbEc_g&usqp=CAU"
    // e.mediaElement.srcObject = null;
    // e.mediaElement.setAttribute('poster', connection.extra.img);
    // console.log('muting');
};

//mute all
muteAll.addEventListener('click', () => {
    // // Object.keys(connection.streamEvents).forEach(function (streamid) {
    // //     connection.streamEvents[streamid].stream.mute('audio');
    // // });
    // let parts = connection.getAllParticipants();
    // for (let i = 0; i < parts.length; i++) {
    //     var username = connection.getExtraData(parts[i]);
    // }
    // connection.streamEvents
    //     .selectAll({
    //         // local: true,
    //         isAudio: true,
    //     })
    //     .forEach(function (localAudioStreamEvent) {
    //         localAudioStreamEvent.stream.getAudioTracks().forEach(function (track) {
    //             track.stop();
    //         });
    //     });
    socket.emit('renderMuteAll')
});

socket.on('renderMuteAll', () => {
    audioControl.click()
    // connection.extra.isAudioMuted = true
    // connection.updateExtraData();
    // audioControl.innerHTML = `<i style = "color:#ff6a00;" class=" fas fa-microphone-slash"></i>`
    // renderUsers()
})

whiteBoardBtn.addEventListener('click', () => {
    mainVideo.style.display = 'none'
    whiteBoardContainer.style.display = ''
})
