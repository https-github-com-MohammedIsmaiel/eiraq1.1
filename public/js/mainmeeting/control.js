
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
    if (connection.extra.isAudioMuted === true) {
        return
    } else {
        audioControl.click()
    }
    // connection.extra.isAudioMuted = true
    // connection.updateExtraData();
    // audioControl.innerHTML = `<i style = "color:#ff6a00;" class=" fas fa-microphone-slash"></i>`
    // renderUsers()
})

whiteBoardBtn.addEventListener('click', () => {
    mainVideo.style.display = 'none'
    whiteBoardContainer.style.display = ''
})
//admin permision
const allowShare = document.querySelector('#allowShare')
const allowChat = document.querySelector('#allowChat')
let canShare = false
let canChat = false
if (connection.isInitiator) {
    console.log('i can share and chat');
    canShare = true
    canChat = true
}
allowChat.addEventListener('click', () => {
    socket.emit('disallowChat')
})
allowShare.addEventListener('click', () => {
    socket.emit('disallowShare')
})
socket.on('disallowShare', () => {
    shareScreen.style.display = ''
})
socket.on('disallowChat', () => {
    msg.style.display = ''
})