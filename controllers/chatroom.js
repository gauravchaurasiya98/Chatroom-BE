const Chatroom = require("../models/chatroom");

exports.createChatroom = async (req, res) => {
  try {
    const { name, isGroup } = req.body;
    const chatroom = new Chatroom({ name, isGroup });
    await chatroom.save();
    res
      .status(201)
      .json({ chatroom, message: "Chatroom created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating chatroom", error: error.message });
  }
};

exports.findChatroomIdByName = async (name) => {
  const chatroom = await Chatroom.findOne({ name }, "_id");
  return chatroom?._id.toString();
};

exports.addUserToChatroom = async (chatroomId, userId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom.members.includes(userId)) {
    chatroom.members.push(userId);
    await chatroom.save();
  }
};

exports.updateLastMessageInChatroom = async (chatroomId, messageId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  chatroom.lastMessage = messageId;
  await chatroom.save();
};
