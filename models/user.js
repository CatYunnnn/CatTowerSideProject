const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: [Number],
    required: true,
  },
  role: {
    type: [String],
    default: [0],
  },
  level: {
    type: String,
    default: "0",
  },
  money: {
    type: [String],
    default: ["0", "1"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("userList", userListSchema);
