const ls = localStorage.getItem("selected");
let selected = false;
var list = document.querySelectorAll(".list"),
    content = document.querySelector(".content"),
    input = document.querySelector(".card-footer input"),
    open = document.querySelector(".open a");



//process
function process() {
  if(ls != null) {
    selected = true;
    click(list[ls], ls);
  }
  if(!selected) {
    click(list[0], 0);
  }

  list.forEach((l,i) => {
    l.addEventListener("click", function() {
      click(l, i);
    });
  });
  
  try {
    document.querySelector(".list.active").scrollIntoView(true);
  }
  catch {}
  
}
process();

var receiver;
//list click
function click(l, index) {
  list.forEach(x => { x.classList.remove("active"); });
  if(l) {
    l.classList.add("active");
    document.querySelector("sidebar").classList.remove("opened");
    open.innerText="UP";
    const img = l.querySelector("img").src,
          user = l.querySelector(".user").innerText;
          user_id= l.querySelector(".receiver_id").value;
    receiver_id = user_id;

    content.querySelector("img").src = img;
    content.querySelector(".info .user").innerHTML = user;
   

    const inputPH = input.getAttribute("data-placeholder");
    input.placeholder = inputPH.replace("{0}", user.split(' ')[0]);

    document.querySelector(".message-wrap").scrollTop = document.querySelector(".message-wrap").scrollHeight;
    
    localStorage.setItem("selected", index);
  }
}

open.addEventListener("click", (e) => {
  const sidebar = document.querySelector("sidebar");
  sidebar.classList.toggle("opened");
  if(sidebar.classList.value == 'opened')
    e.target.innerText = "DOWN";
  else
    e.target.innerText = "UP";
});


///////////////////////////////////////////////////////


// Emoji
const inputElm = document.querySelector('input');
const emojiBtn = document.querySelector('#emoji-btn');
const picker = new EmojiButton();


// Emoji selection  
window.addEventListener('DOMContentLoaded', () => {

    picker.on('emoji', emoji => {
      document.getElementById('txtMessage').value += emoji;
    });
  
    emojiBtn.addEventListener('click', () => {
      picker.togglePicker(emojiBtn);
    });
  });        












function myFunction() {
  // Declare variables
  var input, filter, lists, list, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  lists = document.getElementById("myLists");
  list= document.getElementsByClassName("list");


  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < list.length; i++) {
    listcontent = list[i].getElementsByTagName("span")[0];
    txtValue = listcontent.textContent || listcontent.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = "";
    } else {
      list[i].style.display = "none";
    }
  }
}


var socket = io();
$("#form").on( "click", function() {
  if($('#txtMessage').val()!=''){
  socket.emit('message',{"sender_id":sender_id,"receiver_id":receiver_id,"message":$('#txtMessage').val()});
  $('#txtMessage').val('');
  }else{

  }
});
socket.on('server message',(msg)=>{

  if (msg.sender_id == sender_id)
  {
    console.log(sender_id)
    console.log(msg.sender_id)
    $('#messages').append($('<li class="me">').text(msg.message));
  }
  else{
    $('#messages').append($('<li class="you">').text(msg.message));
  }
});

