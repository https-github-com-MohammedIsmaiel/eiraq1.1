const joinLab = document.querySelector('#joinLab')
const joinSection = document.querySelector('#joinSection')
const joinMainRoom = document.querySelector('#joinMainRoom')

joinLab.addEventListener('click', (e) => {
    // videoContainer.innerHTML = ''
    console.log('joining lab');
    openOrJoin(ROOM_ID + '-lab')
    renderUsers()
})

joinSection.addEventListener('click', (e) => {
    // videoContainer.innerHTML = ''
    console.log('joining section');
    openOrJoin(ROOM_ID + '-section')
    renderUsers()
})

joinMainRoom.addEventListener('click', (e) => {
    console.log('joining section');
    openOrJoin(ROOM_ID)
    renderUsers()
})

const openOrJoin = (roomId) => {
    connection.closeSocket();
    // socket.disconnect()
    socket.emit('join-room', roomId)
    connection.openOrJoin(roomId, function (isRoomCreated, roomid, error) {
        if (connection.isInitiator === true) {
            // you opened the room
        } else {
            // you joined it
        }
    });
}