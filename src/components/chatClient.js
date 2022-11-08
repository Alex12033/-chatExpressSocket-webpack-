function chatClientModule() {
  let socket = io();

  let sendBtn = document.querySelector("#sendBtn");

  let messageArea = document.querySelector("#message-text");
  messageArea.contentEditable = true;
  // used div instead of textarea and input because they not support of past img(smiles)

  let avatarName = document.querySelector(".info-avatar__name");

  let windowMsg = document.querySelector(".message-window");

  let userWrites = document.querySelector(".user-write");

  let infoMessage = document.querySelector(".info-msg");

  do {
    username = prompt("Your name: ");
    avatarName.textContent = username;
  } while (!username);
  socket.emit("new user joined", username);

  //smiles logic
  let smileContainer = document.querySelector(".smiles-container");

  let openSmile = document.querySelector(".open-smile");

  let smiles = document.querySelectorAll(".smile");
  let allSmilesSrc = []; //for many smiles
  smiles.forEach((element, index) => {
    let smileSrc = null; //for path one smiles and then we save path in array allSmiles
    element.addEventListener("click", (e) => {
      smileSrc = e.target.src.replace(
        /^[a-z]{4}\:\/{2}[a-z]{1,}\:[0-9]{1,4}.(.*)/,
        "$1"
      );

      allSmilesSrc.push(smileSrc); //for we may add more then one smile

      smileContainer.classList.remove("smile-active"); //close smiles

      let imgSmile = document.createElement("img");
      imgSmile.src = smileSrc;
      imgSmile.style.width = "50px";
      messageArea.appendChild(imgSmile); //insert smile which user enter in area input
    });
  });

  openSmile.addEventListener("click", () => {
    smileContainer.classList.toggle("smile-active"); //open smiles
  });

  //set message in socket from text area
  sendBtn.addEventListener("click", function (e) {
    if (messageArea.innerText) {
      socket.emit(
        "private message",
        username,
        messageArea.innerText,
        allSmilesSrc
      );

      allSmilesSrc.length = 0;

      messageArea.innerText = "";
    } else {
      //else user send only smile without text
      socket.emit("private message", username, "", allSmilesSrc);

      allSmilesSrc.length = 0;

      messageArea.innerText = "";
    }
  });

  //this method render message from diferent users from socket
  function person(div, setAtr, fromSocket, span) {
    let messages = document.querySelector(".fix-wrapper");

    /* here we create div with special id 
      for msg user name online status and time msg */
    let item = document.createElement(div);
    item.setAttribute(setAtr.id, setAtr.idName);
    item.innerText = fromSocket.msg; //we save message from socket in div

    if (setAtr.idName === "person-sender" && setAtr.smileArr) {
      for (let i = 0; i < setAtr.smileArr.length; i++) {
        item.innerHTML += `<img width="40px" src="${setAtr.smileArr[i]}" alt="smile"/>`;
      }
    }

    setTimeout(() => {
      item.style.opacity = "1";
    }, 100);

    messages.appendChild(item);

    //here we create span for username and get from socket
    let nameSender = document.createElement(span);
    nameSender.textContent = fromSocket.from + ":";
    nameSender.style.marginRight = "5px";
    item.prepend(nameSender);

    //here we create date of message and get it from socket
    let date = document.createElement(div);
    date.setAttribute(setAtr.class, setAtr.className);
    date.textContent = fromSocket.date;
    item.appendChild(date);

    if (setAtr.idName === "person-reciver" && setAtr.smileArr) {
      for (let i = 0; i < setAtr.smileArr.length; i++) {
        item.innerHTML += `<img width="40px" src="${setAtr.smileArr[i]}" alt="smile"/>`;
      }
    }

    /* setAtr.activateStatus with 
      help this flag we render status 
      online/offline in message what we
       recive from socket   */
    if (setAtr.activateStatus) {
      windowMsg.scrollTo(0, document.body.scrollHeight); //we scroll to bottom on new message
      let statusIndicator = document.createElement(div);
      statusIndicator.setAttribute(setAtr.class, setAtr.setStatus);
      statusIndicator.style.background = "green";

      socket.on("isOnline", (statusUser) => {
        statusIndicator.style.background =
          statusUser.isConected === false ? "gray" : "green";
      });
      item.appendChild(statusIndicator);
    } else {
    }
  }

  //on focus or blur input event for send status type or not user message in socket
  let focusFlag = "";

  messageArea.addEventListener("focus", (e) => {
    focusFlag = true;

    socket.emit("onFocus", focusFlag);
  });

  messageArea.addEventListener("blur", (e) => {
    focusFlag = false;

    socket.emit("onBlur", focusFlag);
  });

  //get all information from socket
  socket.on("private message", (socketInfo) => {
    infoMessage.style.opacity = "0"; //when user send first message in chat info message will be deleted

    //heare we may see who sender or reciver and to branch logic

    if (username !== socketInfo.from) {
      // prompt username = example !== {from: example} this construction help undestantand we write or recive on/from socket
      person(
        "div",
        {
          id: "id",
          class: "class",
          idName: "person-reciver",
          className: "date",
          activateStatus: true,
          setStatus: "status",
          smileArr: socketInfo.smilePaths,
        },
        socketInfo,
        "span"
      );

      let audio = new Audio(); //sound for incoming message
      audio.volume = 0.1;
      audio.preload = "auto";
      audio.src = "../assets/chatSound/incomingMsg.mp3";
      audio.play();
    } else {
      person(
        "div",
        {
          id: "id",
          class: "class",
          idName: "person-sender",
          className: "date",
          activateStatus: false,
          smileArr: socketInfo.smilePaths,
        },
        socketInfo,
        "span"
      );

      socket.on("isFocus", (isFocus) => {
        focusFlag
          ? (userWrites.style.display = "none")
          : (userWrites.style.display = "block");
      });

      socket.on("isBlur", (isBlur) => {
        focusFlag
          ? (userWrites.style.display = "block")
          : (userWrites.style.display = "none");
      });
    }
  });
}

module.exports = chatClientModule;
