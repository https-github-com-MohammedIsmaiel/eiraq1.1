/** @format */

const attendence = document.getElementById('attendence');
const raiseHand_btn = document.getElementById('raiseHand_btn');
const usersList = document.getElementById('users_list');
var raiseHandFlag = false;

const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
const lamp = document.querySelector('.timeLamp');
let totalSeconds = 0;

setInterval(() => {
	lamp.classList.toggle('colorred');
	setTimeout(() => {
		lamp.classList.toggle('colorwhite');
	}, 100);
}, 600);

setInterval(() => {
	++totalSeconds;
	secondsLabel.innerHTML = pad(totalSeconds % 60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}, 1000);

// function setTime() {}
const pad = (val) => {
	let valString = val + '';
	return valString.length < 2 ? '0' + valString : valString;
};

attendence.addEventListener('click', () => {
	var allUsers = [];
	let par = connection.getAllParticipants();
	for (let i = 0; i < par.length; i++) {
		var username = connection.getExtraData(par[i]);
		allUsers.push(`${i + 1} - ${username.username} \n`);
	}
	var myBlob = new Blob(['Attendence: \n' + allUsers], { type: 'text/plain' });
	var url = window.URL.createObjectURL(myBlob);
	var anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = 'attendance.txt';
	anchor.click();
	window.URL.revokeObjectURL(url);
});

raiseHand_btn.addEventListener('click', () => {
	if (raiseHandFlag === false) {
		raiseHandFlag = true;
	} else {
		raiseHandFlag = false;
	}
	connection.extra.raiseHand = raiseHandFlag;
	connection.updateExtraData();
	renderUsers();
});
connection.onExtraDataUpdated = function (event) {
	renderUsers();
};

const renderUsers = () => {
	let par = connection.getAllParticipants();
	usersList.innerHTML = `
    <div class="userfriend">
        <img src="${connection.extra.img}"
            width="50px" alt="" />
        <label>${logedInUser.innerText}</label>
        <i style="display:${
			connection.extra.raiseHand ? '' : 'none'
		}" id="raiseHand" class="fas fa-hand-paper"></i>
        <i style="display:${
			connection.extra.isAudioMuted ? '' : 'none'
		}" class=" fas fa-microphone-slash"></i>
        <i style="display:${
			connection.extra.isVideoMuted ? '' : 'none'
		}" class="fas fa-video-slash"></i>
    
    </div>`;
	for (let i = 0; i < par.length; i++) {
		var user = connection.getExtraData(par[i]);
		usersList.innerHTML += `
        <div class="userfriend">
            <img src="${user.img}"
                width="50px" alt="" />
            <label>${user.username}</label>
            <i style="display:${user.raiseHand ? '' : 'none'}"
            id="raiseHand" class="fas fa-hand-paper"></i>
            <i style="display:${
				user.isAudioMuted ? '' : 'none'
			}" class=" fas fa-microphone-slash"></i>
            <i style="display:${user.isVideoMuted ? '' : 'none'}" class="fas fa-video-slash"></i>
            
        </div>`;
	}
};

renderUsers();
