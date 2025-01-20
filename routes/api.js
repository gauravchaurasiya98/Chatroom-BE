const apiRouter = require("express").Router();
const chatroomController = require("../controllers/chatroom");
const messageController = require("../controllers/message");

apiRouter.post("/chatrooms", chatroomController.createChatroom);
apiRouter.get("/messages/:room", messageController.fetchMessages);
apiRouter.post("/messages/:room", messageController.addMessageFromRequest);

module.exports = apiRouter;
