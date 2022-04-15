// // Express server
const express = require("express");

const PORT = process.env.PORT || 4000;
// const PORT = process.env.PORT;
const INDEX = "/index.html";
const app = express();
// app.use((_req, res) => res.sendFile(INDEX, { root: __dirname }));
const server = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}..`)
);

// socket server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});


io.on("connection", (socket) => {
  socket.on("reqTurn", (data) => {
    const room = JSON.parse(data).room;
    io.to(room).emit("playerTurn", data);
  });
  socket.on("create", (room) => {
    socket.join(room);
    console.log("Create: "+room);
    console.log("Joined: "+room);
  });
  socket.on("join", (room) => {
    socket.join(room);
    io.to(room).emit("opponent_joined");
    console.log("Joined: "+room);
  });
  socket.on("reqRestart", (data) => {
    const room = JSON.parse(data).room;
    console.log("Game restart");
    console.log("Room: "+room);
    io.to(room).emit("restart");
  });
});


console.log("The WebSocket server is running on port 4000");
