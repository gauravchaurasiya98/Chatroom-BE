const messageController = require("./message");

// Active WebSocket connections
const activeConnections = new Map();

exports.handleConnections = (io, socket) => {
  activeConnections.set(socket.id, socket);
  console.log(`User connected: ${socket.user.id}`);

  socket.on("joinRoom", (room, callback) => {
    if (!socket.rooms.has(room)) {
      socket.join(room);
      console.log(`${socket.user.id} joined room ${room}`);
    }
    callback({ success: true, room });
  });

  socket.on("sendMessage", async ({ room, content }, callback) => {
    try {
      if (socket.rooms.has(room)) {
        const message = await messageController.addMessage(
          socket.user.id,
          room.replace("_", " "),
          content
        );
        if (message) {
          const resMessage = {
            _id: message._id,
            sender: { _id: socket.user.id, fullName: socket.user.fullName },
            content: message.content,
            createdAt: message.createdAt,
          };
          // Broadcast the message to all clients
          io.to(room).emit("newMessage", {
            room,
            message: resMessage,
          });
          if (callback) {
            callback({ message: resMessage });
          }
        } else {
          console.error("Error saving message");
          if (callback) callback({ error: "Error saving message" });
        }
      } else {
        console.error("User is not in the room");
        if (callback) callback({ error: "You are not in this room" });
      }
    } catch (error) {
      console.error("Error in sendMessage handler:", error);
      if (callback) callback({ error: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
    activeConnections.delete(socket.id);
  });
};

exports.closeWebSocketConnections = () => {
  console.log("Closing WebSocket connections...");
  activeConnections.forEach((socket) => {
    socket.disconnect(true); // Disconnect all clients
  });
  console.log("WebSocket connections has been closed.");
};
