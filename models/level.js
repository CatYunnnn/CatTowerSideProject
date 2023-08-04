const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const levelListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  skills: {
    type: [Number],
    required: true,
  },
  spec: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("levelList", levelListSchema);
