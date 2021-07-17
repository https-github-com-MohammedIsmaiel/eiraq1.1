/** @format */

const joinLab = document.querySelector('#joinLab');
const joinSection = document.querySelector('#joinSection');
const joinMainRoom = document.querySelector('#joinMainRoom');
const sectionUsers = document.querySelector('#other');
const labUsers = document.querySelector('#main');
const labMembers = document.querySelector('#labMembers');
const sectionMembers = document.querySelector('#sectionMembers');

joinLab.addEventListener('click', (e) => {
	// videoContainer.innerHTML = ''
	removeOldStreams();
	openOrJoin(ROOM_ID + '-lab');
	joinLabUsers();
	labMembers.innerHTML = '';
	labUsersArr.forEach((user) => {
		labMembers.innerHTML += `<li>${user}</li>`;
	});
});

joinSection.addEventListener('click', (e) => {
	// videoContainer.innerHTML = ''
	removeOldStreams();
	openOrJoin(ROOM_ID + '-section');
	joinSectionUsers();
	sectionMembers.innerHTML = '';
	sectionUsersArr.forEach((user) => {
		sectionMembers.innerHTML += `<li>${user}</li>`;
	});
});

joinMainRoom.addEventListener('click', (e) => {
	removeOldStreams();
	openOrJoin(ROOM_ID);
});

const openOrJoin = (roomId) => {
	connection.closeSocket();
	// socket.disconnect()
	connection.openOrJoin(roomId, function (isRoomCreated, roomid, error) {
		if (connection.isInitiator === true) {
			// you opened the room
		} else {
			// you joined it
		}
	});
};

const removeOldStreams = () => {
	connection.getAllParticipants().forEach(function (participantId) {
		connection.disconnectWith(participantId);
	});
};
let allLabUsers = [];
let allSectionUsers = [];
const joinSectionUsers = (room) => {
	socket.emit('leaveSection', connection.extra.username);
	socket.emit('leaveLab', connection.extra.username);
	socket.emit('joinSection', connection.extra.username);
	// socket.emit('', connection.extra.username)
};
// sub rooms attributes
let labUsersArr = [];
let sectionUsersArr = [];
const joinLabUsers = () => {
	socket.emit('leaveSection', connection.extra.username);
	socket.emit('leaveLab', connection.extra.username);
	socket.emit('joinLab', connection.extra.username);
};

//rendering breackout rooms users
socket.on('joinSection', (data) => {
	sectionUsersArr.push(data);
});

socket.on('joinLab', (data) => {
	labUsersArr.push(data);
});

socket.on('leaveSection', (data) => {
	if (!data) return;
	sectionUsersArr = sectionUsersArr.filter((name) => name !== data);
});

socket.on('leaveLab', (data) => {
	if (!data) return;
	labUsersArr = labUsersArr.filter((name) => name !== data);
});
