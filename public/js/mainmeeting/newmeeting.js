
const shareScreen = document.querySelector('#shareScreen')
const videoContainer = document.querySelector('#allUser')
const shareContainer = document.querySelector('#shareContainer')
const logedInUser = document.querySelector('#logedInUser')
const audioControl = document.querySelector('#audioControl')
const videoControl = document.querySelector('#videoControl')
var localStream
var localStreamId


//init connection
var connection = new RTCMultiConnection()
connection.socketURL = '/'
connection.session = {
    Audio: true,
    video: true,
    // screen:true
}

//connection extra data
connection.extra = {
    username: logedInUser.innerText,
    raiseHand: false,
    isAudioMuted: false,
    isVideoMuted: false,
    // img: document.querySelector('#profileImg').src
}
//joining room
socket.emit('join-room', ROOM_ID)

//connection settings
connection.sdpConstraints.mandatory = {
    OfferToRecieveAudio: true,
    OfferToRecieveVideo: true,
}

//setting audio and video 
var bitrates = 512;
var resolutions = 'Ultra-HD';
var videoConstraints = {};

if (resolutions == 'HD') {
    videoConstraints = {
        width: {
            ideal: 1280
        },
        height: {
            ideal: 720
        },
        frameRate: 30
    };
}

if (resolutions == 'Ultra-HD') {
    videoConstraints = {
        width: {
            ideal: 1920
        },
        height: {
            ideal: 1080
        },
        frameRate: 30
    };
}

connection.mediaConstraints = {
    video: videoConstraints,
    audio: true
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
            screen: bitrates
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
            screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });
    }

    return sdp;
};

//set ice servers (stun and turn)
connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}];

//setting screen container
connection.videosContainer = videoContainer
//start getting streams
console.log(connection);
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
    localStreamId = event.streamid

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
    console.log('hello')
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
        oneway: true
    });
})
//mute and unmute
audioControl.addEventListener('click', (e) => {
    if (connection.extra.isAudioMuted === false) {
        // connection.streamEvents[connection.userid].stream.mute('audio');
        connection.extra.isAudioMuted = true
        localStream.mute('audio');
        audioControl.innerHTML = `<i class=" fas fa-microphone-slash"></i>`
    } else {
        connection.extra.isAudioMuted = false
        // connection.streamEvents[connection.userid].stream.unmute('audio');
        localStream.unmute('audio');
        audioControl.innerHTML = `<i class=" fas fa-microphone"></i>`
        connection.streamEvents.selectFirst('local').mediaElement.muted = true;
    }
})

videoControl.addEventListener('click', (e) => {
    var firstLocalStream = connection.streamEvents.selectFirst({
        local: true
    }).stream;
    if (connection.extra.isVideoMuted === false) {
        connection.extra.isVideoMuted = true
        firstLocalStream.mute('video');
        videoControl.innerHTML = `<i class="fas fa-video-slash"></i>`
        connection.attachStreams[0].getVideoTracks().forEach(function (track) {
            track.stop(); // turn off cam
        });
    } else {
        connection.extra.isVideoMuted = false
        firstLocalStream.unmute('video');
        videoControl.innerHTML = `<i class="fas fa-video"></i>`
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia({ video: true }, function (videoStream) {
            connection.attachStreams[0].addTrack(videoStream.getVideoTracks()[0]); // enable video again
            connection.renegotiate();  // share again with all users
        }, function () { });
    }
})

//handle on mute
connection.onmute = function (e) {
    $(`#${localStreamId}`).poster = "/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBhSHCY3v0mocVZF2bOz-Qtd5cHojpbEc_g&usqp=CAU"
    e.mediaElement.srcObject = null;
    e.mediaElement.setAttribute('poster', connection.extra.img);
};
