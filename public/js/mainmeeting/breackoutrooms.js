const joinLab = document.querySelector('#joinLab')
const joinSection = document.querySelector('#joinSection')
const joinMainRoom = document.querySelector('#joinMainRoom')
const sectionUsers = document.querySelector('#other')
const labUsers = document.querySelector('#main')

joinLab.addEventListener('click', (e) => {
    // videoContainer.innerHTML = ''
    removeOldStreams()
    console.log('joining lab');
    openOrJoin(ROOM_ID + '-lab')
})

joinSection.addEventListener('click', (e) => {
    // videoContainer.innerHTML = ''
    removeOldStreams()
    console.log('joining section');
    openOrJoin(ROOM_ID + '-section')
})

joinMainRoom.addEventListener('click', (e) => {
    removeOldStreams()
    console.log('joining section');
    openOrJoin(ROOM_ID)
})

const openOrJoin = (roomId) => {
    connection.closeSocket();
    // socket.disconnect()
    connection.openOrJoin(roomId, function (isRoomCreated, roomid, error) {
        console.log('joined');
        if (connection.isInitiator === true) {
            // you opened the room
        } else {
            // you joined it
        }
    });
}
const joinSectionUsers = (room) => {
    socket.emit('joinSection', connection.extra.username)

    // let par = connection.getAllParticipants()
    // room.innerHTML = `<li>${connection.extra.username}</li>`
    // for (let i = 0; i < par.length; i++) {
    //     var user = connection.getExtraData(par[i]);
    //     if (!user) { return }
    //     room.innerHTML += `
    //         <li>${user.username}</li>
    //         `
    // }
}

const joinLabUsers = () => {
    socket.emit('joinLab', connection.extra.username)

}

//rendering breackout rooms users
socket.on('joinSection', (data) => {

})

socket.on('joinLab', (data) => {

})

socket.on('leaveSection', (data) => {

})

socket.on('leaveLab', (data) => {

})

const removeOldStreams = () => {
    connection.getAllParticipants().forEach(function (participantId) {
        connection.disconnectWith(participantId);
    });
    //or use ...
    // let allUserStreams = connection.getRemoteStreams();
    // allUserStreams.forEach(stream => {
    //     connection.removeStream(stream);
    // });
    //or use ....
    // Object.keys(connection.streamEvents).forEach(function (streamid) {
    //     connection.removeStream(streamid);
    // });
}