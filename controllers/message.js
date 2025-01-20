const Message = require("../models/Message");
const chatroomController = require("./chatroom");

const saveMessage = async (sender, chatroom, content) => {
  const message = new Message({ sender, chatroom, content });
  return await message.save();
};

exports.addMessage = async (sender, chatroomName, content) => {
  try {
    const chatroomId = await chatroomController.findChatroomIdByName(
      chatroomName
    );
    return await saveMessage(sender, chatroomId, content);
  } catch (error) {
    console.error("Error saving message:", error.message);
    return null;
  }
};

exports.addMessageFromRequest = async (req, res) => {
  try {
    const { sender, content } = req.body;
    const chatroomName = req.params.room.replace("_", " ");
    const chatroomId = await chatroomController.findChatroomIdByName(
      chatroomName
    );
    if (!chatroomId) {
      return res.status(404).json({
        message: `Error while addMessage: Chatroom with name(${chatroomName}) doesn't exist!`,
      });
    }
    const message = await saveMessage(sender, chatroomId, content);
    await chatroomController.updateLastMessageInChatroom(
      chatroomId,
      message._id
    );
    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving message", error: error.message });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { before } = req.query;
    const chatroomName = req.params.room.replace("_", " ");
    const chatroomId = await chatroomController.findChatroomIdByName(
      chatroomName
    );
    if (!chatroomId) {
      return res.status(404).json({
        message: `Error while fetchMessages: Chatroom with name(${chatroomName}) doesn't exist!`,
      });
    }
    const query = { chatroom: chatroomId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    const messages = await Message.find(query)
      .select(["sender", "content", "createdAt"])
      .populate("sender", "fullName")
      .sort({ createdAt: -1 }) // Most recent messages first
      .limit(20);
    res.json(messages.reverse()); // Reverse to maintain chronological order
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
