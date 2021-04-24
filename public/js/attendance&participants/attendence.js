const attendence = document.getElementById('attendence')
const raiseHand_btn = document.getElementById("raiseHand_btn");
const usersList = document.getElementById('users_list')
var raiseHandFlag = false
// const profile_img = document.getElementById('profile_img').src;
// console.log(profile_img)

attendence.addEventListener('click', () => {
    var allUsers = []
    let par = connection.getAllParticipants()
    for (let i = 0; i < par.length; i++) {
        var username = connection.getExtraData(par[i]);
        allUsers.push(`${i + 1} - ${username.username} \n`);
    }
    var myBlob = new Blob(["Attendence: \n" + allUsers], { type: 'text/plain' });
    var url = window.URL.createObjectURL(myBlob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "attendance.txt";
    anchor.click();
    window.URL.revokeObjectURL(url);
})

raiseHand_btn.addEventListener('click', () => {
    if (raiseHandFlag === false) {
        raiseHandFlag = true
    } else {
        raiseHandFlag = false
    }
    connection.extra.raiseHand = raiseHandFlag
    connection.updateExtraData();
    renderUsers()
})
connection.onExtraDataUpdated = function (event) {
    renderUsers()
};



const renderUsers = () => {
    console.log('renderingusers');
    let par = connection.getAllParticipants()
    console.log(connection.extra.img);
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
    
    // `<div class="userdesign row justify-content-around align-items-center m-0 my-2 w-100">
    // <div class="col-3 ">
    // <img class="pic "
    //     src="https://jizaladv.com/catalog/view/theme/default/image/avatar.jpg "
    //     width="50px " />
    // </div>
    // <div class="col ">${logedInUser.innerText} <!--raise hand-->
    // <i style="display:${connection.extra.raiseHand ? "" : "none"}" id="raiseHand" class="fas fa-hand-paper"></i>
    // <i style="display:${connection.extra.isAudioMuted ? "" : "none"}" class=" fas fa-microphone-slash"></i>
    // <i style="display:${connection.extra.isVideoMuted ? "" : "none"}" class="fas fa-video-slash"></i>

    // </div>
    // </div>`
    for (let i = 0; i < par.length; i++) {
        var user = connection.getExtraData(par[i]);
        console.log(user.raiseHand)
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
            <i style="display:${
				user.isVideoMuted ? '' : 'none'
			}" class="fas fa-video-slash"></i>
            
        </div>`;
        
        // `<div class="userdesign row justify-content-around align-items-center m-0 my-2 w-100">
        // <div class="col-3 ">
        //     <img class="pic "
        //         src="https://jizaladv.com/catalog/view/theme/default/image/avatar.jpg "
        //         width="50px " />
        // </div>
        // <div class="col ">${user.username} <i style="display:${user.raiseHand ? "" : "none"}"
        // id="raiseHand" class="fas fa-hand-paper"></i>
        // <i style="display:${user.isAudioMuted ? "" : "none"}" class=" fas fa-microphone-slash"></i>
        // <i style="display:${user.isVideoMuted ? "" : "none"}" class="fas fa-video-slash"></i>
        // </div>
        // </div>`
    }
}



renderUsers()