const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
