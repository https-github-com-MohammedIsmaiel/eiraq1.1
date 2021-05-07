connection.openOrJoin('room-id', function (isRoomCreated, roomid, error) {
    if (connection.isInitiator === true) {
        // you opened the room
    } else {
        // you joined it
    }
});