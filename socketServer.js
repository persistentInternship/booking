const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
  io = new Server(server);
  
  io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getIO };