const { Schema, model } = require("mongoose");

const chatroomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // Chatroom name for group chats
    isGroup: { type: Boolean, default: false }, // Distinguishes private and group chats
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // References the User model
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Reference to the last message
    },
  },
  { timestamps: true }
);

module.exports = model("Chatroom", chatroomSchema);
