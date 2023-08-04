const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  HpTimes: {
    type: String,
    required: true,
  },
  skills: {
    type: [Number],
    required: true,
  },
  rarity: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("roleList", roleListSchema);
