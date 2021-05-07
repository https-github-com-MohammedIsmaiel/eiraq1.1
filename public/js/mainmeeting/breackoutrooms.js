const joinLab = document.querySelector('#joinLab')
const joinSection = document.querySelector('#joinSection')
const joinMainRoom = document.querySelector('#joinMainRoom')

joinLab.addEventListener('click', (e) => {
    console.log('joining lab');
    openOrJoin(ROOM_ID + '-lab')
})

joinSection.addEventListener('click', (e) => {
    console.log('joining section');
    openOrJoin(ROOM_ID + '-section')
})

joinMainRoom.addEventListener('click', (e) => {
    console.log('joining section');
    openOrJoin(ROOM_ID)
})

const openOrJoin = (roomId) => {
    connection.closeSocket();
    socket.emit('join-room', roomId)
    connection.openOrJoin(roomId, function (isRoomCreated, roomid, error) {
        if (connection.isInitiator === true) {
            // you opened the room
        } else {
            // you joined it
        }
    });
}