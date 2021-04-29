function slideMain() {
    let sl = document.getElementById('main')
        sl.classList.toggle('displayed')
}
function slideOther() {
    let s2 = document.getElementById('other')
        s2.classList.toggle('displayed')
}

function rooms() {
    let s3 = document.querySelector('.breakrooms');
    s3.classList.toggle('breakroomsdisplayed')

    s3.classList.contains('breakroomsdisplayed') ?
        setTimeout(() => {     
            document.getElementById('btnroom').innerHTML = '<i style = "color:#ff6a00" class="fad fa-angle-double-left"></i>'
        }, 400) :
        setTimeout(() => {
            document.getElementById('btnroom').innerHTML = '<i class="fad fa-angle-double-right"></i>'
        }, 300)
}

function rotate() {
    let card = document.querySelector('.cards');
    card.classList.add('cardrotate');
    card.classList.remove('cardrotatex');
}

function rotatex() {
    let card = document.querySelector('.cards');
    card.classList.add('cardrotatex');
    card.classList.remove('cardrotate');

}
function colorRed() {
    let color = document.getElementById('x');
    color.classList.toggle('gold')
}
function vote() {
    let card = document.querySelector('.cards');
    let color = document.getElementById('votebtn');
    color.classList.toggle('gold');
    card.classList.toggle('cardshow');
}

let video = document.getElementById('vid')
let mesage = document.querySelector('.mesage');
let friends = document.querySelector('.friends');
let msgicon = document.querySelector('.fa-envelope')
let vidIvon = document.querySelector('.fa-users')
// open / close chat window
document.getElementById('msg').addEventListener("click", () => {
    if (mesage.classList.contains("disp")) {
        mesage.classList.add("hide");
        mesage.classList.remove("disp");
        msgicon.classList.remove('gold')
        video.classList.toggle('width')
    } else {
        mesage.classList.remove("hide");
        mesage.classList.add("disp");
        msgicon.classList.add('gold')
        video.classList.toggle('width')
    }
    if (friends.classList.contains("disp")) {
        friends.classList.add("hide");
        friends.classList.remove("disp");
        vidIvon.classList.remove('gold');
        video.classList.toggle('width')
    }
});
// open /close users window
document.getElementById('users').addEventListener("click", () => {
    if (friends.classList.contains("disp")) {
        friends.classList.add("hide");
        friends.classList.remove("disp");
        vidIvon.classList.remove('gold')
        video.classList.toggle('width')
    } else {
        friends.classList.remove("hide");
        friends.classList.add("disp");
        vidIvon.classList.add('gold')
        video.classList.toggle('width')
    }
    if (mesage.classList.contains("disp")) {
        mesage.classList.add("hide");
        mesage.classList.remove("disp");
        msgicon.classList.remove('gold');
        video.classList.toggle('width')
    }
});

function scrollMembers(factor) {
    let members = document.querySelector('.all-users')
    let membersWidth = members.clientWidth
    members.scrollBy(factor * membersWidth, 0)
}
function changeseem() {
    let alluser = document.querySelector('#allUser');
    let userselected = document.querySelector('.uservideo');
    let videos = document.querySelector('#vid');
    let next = document.querySelector('#next');
    let prev = document.querySelector('#prev');
    videos.classList.toggle('mainscreem')
    videos.classList.toggle('all-user-normal')
    alluser.classList.toggle('all-users')
    alluser.classList.toggle('all-users2')
    userselected.classList.toggle('disp-none')
    next.classList.toggle('disp-none')
    prev.classList.toggle('disp-none')
}
var enabled = true;
function blackmoon() {
    if (enabled) {
        document.querySelector(
			"link[href='/css/newroomui/lightprofile.css']",
		).href = '/css/newroomui/blackprofile.css';
        enabled = !enabled;
    } else {
        document.querySelector(
			"link[href='/css/newroomui/blackprofile.css']",
		).href = '/css/newroomui/lightprofile.css';
        enabled = !enabled;
}
}

function dispMeetingInfo() {
    let info = document.getElementsByClassName('meeting-info')[0];
    let icon = document.getElementsByClassName('x')[0]
    info.classList.toggle('meeting-d-none')
    if (info.classList.contains('meeting-d-none')) {
        icon.classList.remove('gold')
    } else {
        icon.classList.add('gold')
    }
}

function openOPtion(){
 let d = document.querySelector('.selectOptiion');
 d.classList.toggle('dspnoneopt')
}


var copyTextareaBtn = document.querySelector('#copy');

copyTextareaBtn.addEventListener('click', function (event) {
	var copyTextarea = document.querySelector('#Url');
	copyTextarea.focus();
	copyTextarea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
	} catch (err) {
		console.log('Oops, unable to copy');
	}
});

function showEmojies() {
	let imo = document.getElementById('imo');
	imo.classList.toggle('hide-imo');
}

function share() {
	let share = document.querySelector('.fa-share-square');
	share.classList.toggle('gold');
}
function record() {
	let record = document.querySelector('.fa-bullseye');
	record.classList.toggle('gold');
}
function raiseHand() {
	let handIcon = document.querySelector('.fa-hand-paper');
	handIcon.classList.toggle('gold');
}
function fileUpload() {
	let file = document.querySelector('.fa-file-alt');
	file.classList.toggle('gold');
}
function caption() {
	let caption = document.querySelector('.fa-closed-captioning');
	caption.classList.toggle('gold');
}

function handleEmojies(id){
    var emojiElement = document.getElementById(id)
    var messageBar = document.getElementById("msgBar")
    messageBar.value += emojiElement.innerText
}