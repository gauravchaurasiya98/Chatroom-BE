const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom", // Reference to the Chatroom model
      required: true,
    },
    content: { type: String, required: true }, // The message content
    isRead: { type: Boolean, default: false }, // Whether the message has been read
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
