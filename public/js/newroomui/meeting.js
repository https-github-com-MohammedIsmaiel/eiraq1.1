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
            document.getElementById('btnroom').innerHTML = '<i class="fad fa-angle-double-left"></i>'
        }, 500) :
        setTimeout(() => {
            document.getElementById('btnroom').innerHTML = '<i class="fad fa-angle-double-right"></i>'
        }, 500)
}

function mic() {
    document.getElementById()
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
    color.classList.toggle('red')
}
function vote() {
    let card = document.querySelector('.cards');
    let color = document.getElementById('votebtn');
    color.classList.toggle('red')
    card.classList.toggle('cardshow');
}
let video = document.getElementById('vid')
let mesage = document.querySelector('.mesage');
let friends = document.querySelector('.friends');

// open / close chat window
document.getElementById('msg').addEventListener("click", () => {
    if (mesage.classList.contains("disp")) {
        mesage.classList.add("hide");
        mesage.classList.remove("disp");
        video.classList.toggle('width')
    } else {
        mesage.classList.remove("hide");
        mesage.classList.add("disp");
        video.classList.toggle('width')
    }
    if (friends.classList.contains("disp")) {
        friends.classList.add("hide");
        friends.classList.remove("disp");
        video.classList.toggle('width')
    }
});
// open /close users window
document.getElementById('users').addEventListener("click", () => {
    if (friends.classList.contains("disp")) {
        friends.classList.add("hide");
        friends.classList.remove("disp");
        video.classList.toggle('width')
    } else {
        friends.classList.remove("hide");
        friends.classList.add("disp");
        video.classList.toggle('width')
    }
    if (mesage.classList.contains("disp")) {
        mesage.classList.add("hide");
        mesage.classList.remove("disp");
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
        icon.classList.remove('coloryello')
    } else {
        icon.classList.add('coloryello')
    }
}

function openOPtion(){
 let d = document.querySelector('.selectOptiion');
 d.classList.toggle('dspnoneopt')
}