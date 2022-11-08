"use strict";

function closeSocialMenu() {
  window.onload = () => {
    function getElement(elem) {
      return document.querySelector(elem);
    }

    let elementsOfChat = [".chat", ".telegram", ".viber", ".phone"];

    let openChat = getElement(".open-chat");
    let closeChatImage = getElement(".close-chat__image");
    let openChatImage = getElement(".open-chat__image");

    openChat.addEventListener("click", () => {
      openChat.classList.toggle("active");

      //open chat context menu
      if (openChat.classList.contains("active")) {
        let marginAcumulate = 15;

        closeChatImage.style.opacity = "1";
        openChatImage.style.opacity = "0";

        closeChatImage.style.animation =
          "smoothDisplayOpenCloseImage .5s forwards ease-in-out";
        openChatImage.style.animation = "none";

        elementsOfChat.forEach((elem) => {
          marginAcumulate += 55;

          getElement(elem).style.pointerEvents = "auto";

          getElement(elem).classList.remove("close-chat-menu");

          getElement(elem).style.visibility = "visible";

          getElement(elem).style.opacity = "1";

          getElement(elem).style.marginBottom = `${marginAcumulate}px`;
        });
      }

      //close chat context menu
      if (!openChat.classList.contains("active")) {
        openChatImage.style.animation =
          "smoothDisplayOpenCloseImage .5s forwards ease-in-out";
        closeChatImage.style.animation = "none";

        elementsOfChat.forEach((elem) => {
          closeChatImage.style.opacity = "0";
          openChatImage.style.opacity = "1";

          getElement(elem).style.pointerEvents = "none";
          getElement(elem).classList.add("close-chat-menu");
        });
      }
    });
  };
}

module.exports = closeSocialMenu;
