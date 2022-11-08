require("../scss/mainPage .scss");
require("../scss/index.scss");

function openChat() {
  let btnChat = document.querySelector(".chat");
  let btnCloseChat = document.querySelector(".close");

  let chat = document.querySelector(".chat-container");

  let sendMsgBtn = document.querySelector(".send-message");

  let audio = new Audio();
  audio.volume = 0.3;
  audio.preload = "auto";

  function eventListener(elem1, audioSrc, ...rest) {
    elem1.addEventListener("click", (e) => {
      if (rest.length > 0) {
        rest[0].classList.toggle("done");
        console.log(rest);
      }

      audio.src = audioSrc;
      audio.play();
    });
  }
  eventListener(btnChat, "./assets/chatSound/openChat.mp3", chat);

  eventListener(btnCloseChat, "./assets/chatSound/closeChat.mp3", chat);

  eventListener(sendMsgBtn, "./assets/chatSound/sendMsg.mp3");
}

module.exports = openChat;
