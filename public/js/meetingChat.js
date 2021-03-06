/** @format */

// chat
///////////////
let msgIcon = document.getElementById('msg');
let isChatOpend = false;
if (msgIcon !== null) {
	msgIcon.onclick = function (isChatOpend) {
		checkChatState();
	};
}

function checkChatState() {
	if (isChatOpend == true) {
		isChatOpend = false;

		msgIcon.innerHTML = '<i class="far fa-envelope"></i>';
	} else {
		isChatOpend = true;
		msgIcon.innerHTML = '<i class="far fa-envelope " style="color:green"></i>';
	}
}
/////////
(function () {
	const messagewriter = logedInUser.innerText;
	socket.emit('message', 'joined', messagewriter);
})();

function leaveMeeting() {
	const messagewriter = logedInUser.innerText;
	socket.emit('message', 'left', messagewriter);
}

let text = $('input.room-chat');
$('html').keydown((e) => {
	if (e.which == 13 && text.val().length !== 0) {
		const messagewriter = logedInUser.innerText;
		socket.emit('message', text.val(), messagewriter);
		text.val('');
	}
});

socket.on('createMessage', (message, messagewriter) => {
	const messegeOwner = logedInUser.innerText;
	if (messegeOwner == messagewriter) {
		$('#chat').append(
			`<li style="color: #00415a;
             list-style: none;
             border: 1px solid #eae3e3;
             background-color: lightcyan;
             border-radius: 13px;
             margin-top : 5px"
             class = "message">
             <b>${messagewriter} : </b>${message}</li>`,
		);
	} else {
		$('#chat').append(
			`<li style = "color: #664d03;
             list-style: none;
             border: 1px solid #bdbdbd;
             background-color: #f1d5d8;
             border-radius: 13px;
             margin-top : 5px"
             class = "message">
             <b>${messagewriter} : </b>${message}</li>`,
		);
	}
	if (isChatOpend == false && msgIcon !== null) {
		msgIcon.innerHTML = '<i class="far fa-envelope gold"></i>';
	}
});
