const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/assets", express.static(__dirname + "/dist/src/assets"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.get("/main.css", (req, res) => {
  res.sendFile(__dirname + "/dist/main.css");
});

app.get("/main.bundle.js", (req, res) => {
  res.sendFile(__dirname + "/dist/main.bundle.js");
});


//socket logic
let users = {};

io.on("connection", (socket) => {
  io.emit("isOnline", {
    //this send on client status of user socket.connected = true || false;
    isConected: socket.connected,
  });

  socket.on("onFocus", (focus) => {
    console.log(focus);

    io.emit("isFocus", focus);
  });

  socket.on("onBlur", (blur) => {
    console.log(blur);

    io.emit("isBlur", {
      stateInput: blur,
    });
  });

  socket.on("private message", function (from, msg, arrPaths) {
    socket.on("disconnect", () => {
      io.emit("isOnline", {
        isConected: false,
      });
    });

    let currentDate = new Date();
    io.emit("private message", {
      from: from,
      msg: msg,
      id: socket.id,
      isConected: socket.connected,
      smilePaths: arrPaths,
      date: `${
        currentDate.getHours() < 10
          ? "0" + currentDate.getHours()
          : currentDate.getHours()
      }:${
        currentDate.getMinutes() < 10
          ? "0" + currentDate.getMinutes()
          : currentDate.getMinutes()
      }`,
    });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("new user joined", (username) => {
    users[socket.id] = username;
    console.log(users);
    socket.emit("users", users);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("listening on 3001 port");
});