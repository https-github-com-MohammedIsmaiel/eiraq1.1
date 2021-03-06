
const leave = document.querySelector('#leave')
const endForAll = document.querySelector('#endForAll')



leave.addEventListener('click', (e) => {
    connection.closeSocket()
    window.location.replace('/leave');

})

if (endForAll != null) {
    endForAll.addEventListener('click', (e) => {
        // disconnect with all users
        connection.getAllParticipants().forEach(function (pid) {
            connection.disconnectWith(pid);
        });
        // stop all local cameras
        connection.attachStreams.forEach(function (localStream) {
            localStream.stop();
        });
        // close socket.io connection
        connection.closeSocket();
        connection.autoCloseEntireSession = true
        socket.emit('endForAll')
        window.location.replace('/leavemeeting');
    })
}
connection.onEntireSessionClosed = function (event) {
    console.log('session closed');
    window.location.replace('/leave');
};

connection.onclose = function (event) {
};

socket.on('endForAll', (d) => {
	console.log('ending');
	window.location.replace('/leavemeeting');
})