console.log("from timer hello");

function setTimer(isInitiator) {
  // const isInitiator = connection.isInitiator;
  // // console.log("is initiator", isInitiator);

  const endForAllBtn = document.getElementById("endForAll");

  //checks whether it is meeting host by the presence of endForAllBtn
  if (endForAll !== null) {
    let value = prompt("Enter Meeting time in minutes")

    while (isNaN(+value)) {
      value = prompt("Enter Meeting time in minutes (Integer)")
    }

    value = +value;

    setTimeout(()=> {
      endForAll.click()
    }, value * 60 * 1000)
  }
}
setTimer();
