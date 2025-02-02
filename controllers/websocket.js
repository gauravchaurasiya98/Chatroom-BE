const messageController = require("./message");
const { authenticateUser } = require("../middlewares/validation");
const CustomError = require("../errors/CustomError");
const ErrorCodes = require("../errors/ErrorCodes");

// Active WebSocket connections
const activeConnections = new Map();

exports.handleConnections = (io, socket) => {
  socket.on("joinRoom", (room, callback) => {
    try {
      authenticateUser(socket, () => activeConnections.set(socket.id, socket));
      if (!socket.rooms.has(room)) {
        socket.join(room);
        console.log(`${socket.user.id} joined room ${room}`);
      }
      callback({ success: true, room });
    } catch (error) {
      console.error("Error joining room:", error.message);
      callback({ error });
    }
  });

  socket.on("sendMessage", async ({ room, content }, callback) => {
    try {
      authenticateUser(socket, () => activeConnections.set(socket.id, socket));
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
          throw new CustomError(
            "Error saving message",
            ErrorCodes.SERVER_ERROR.code
          );
        }
      } else {
        throw new CustomError(
          "User is not in the room",
          ErrorCodes.SERVER_ERROR.code,
          403
        );
      }
    } catch (error) {
      console.error("Error in sendMessage handler:", error.message);
      if (callback) callback({ error });
    }
  });

  socket.on("disconnect", () => {
    if (socket.user) console.log(`User disconnected: ${socket.user.id}`);
    activeConnections.delete(socket.id) && socket.disconnect(true);
  });
};

exports.closeWebSocketConnections = () => {
  console.log("Closing WebSocket connections...");
  activeConnections.forEach((socket) => {
    socket.disconnect(true); // Disconnect all clients
  });
  console.log("WebSocket connections has been closed.");
};
