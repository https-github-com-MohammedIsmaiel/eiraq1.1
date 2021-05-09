const ls = localStorage.getItem("selected");
let selected = false;
var list = document.querySelectorAll(".list"),
    content = document.querySelector(".content"),
    input = document.querySelector(".message-footer input"),
    open = document.querySelector(".open a");

//init
//function init() {
  //input.focus();
  //let now = 2;
  //const texts = ["İyi akşamlar", "Merhaba, nasılsın?",
             //   "Harikasın! :)", "Günaydın", "Tünaydın",
             //   "Hahaha", "Öğlen görüşelim.", "Pekala"];
  //for(var i = 4; i < list.length; i++) {
    //list[i].querySelector(".time").innerText = `${now} day ago`;
    //list[i].querySelector(".text").innerText = texts[(i-4) < texts.length ? (i-4) : Math.floor(Math.random() * texts.length)];
   // now++;
 // }
//}
//init();

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

//list click
function click(l, index) {
  list.forEach(x => { x.classList.remove("active"); });
  if(l) {
    l.classList.add("active");
    document.querySelector("sidebar").classList.remove("opened");
    open.innerText="UP";
    const img = l.querySelector("img").src,
          user = l.querySelector(".user").innerText,
          time = l.querySelector(".time").innerText;

    content.querySelector("img").src = img;
    content.querySelector(".info .user").innerHTML = user;
    content.querySelector(".info .time").innerHTML = time;

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


function loadAllEmoji() {
    var emoji = '';
    for (var i = 128512; i <= 128566; i++) {
        emoji +=`<a href="#" style="font-size: 22px;" onclick="getEmoji(this)">&#${i};</a>`;
    }
    document.getElementById('smiley').innerHTML = emoji;
}
function showEmojiPanel() {
    document.getElementById('emoji').removeAttribute('style');
}
function hideEmojiPanel() {
    document.getElementById('emoji').setAttribute('style', 'display:none;');
}



loadAllEmoji();

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