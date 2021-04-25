// chat


(function () {
    const messagewriter = logedInUser.innerText;
    socket.emit("message", "joined", messagewriter);

})()


function leaveMeeting()  {
	const messagewriter = logedInUser.innerText;
	socket.emit('message', 'left', messagewriter);
}

let text = $('input.room-chat');
$("html").keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(e.value);
        const messagewriter = logedInUser.innerText;
        socket.emit("message", text.val(), messagewriter);
        text.val("");
    }
});

socket.on("createMessage", (message, messagewriter) => {
    const messegeOwner = logedInUser.innerText;
    if (messegeOwner == messagewriter) {
        $("#chat").append(
            `<li style="color:green" class = "message"><b>${messagewriter} : </b>${message}</li>`
        );
    }
    else {
        $("#chat").append(
            `<li class = "message"><b>${messagewriter} : </b>${message}</li>`
        );
    }
});