const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  user: String,
  vault: String,
  type: String,
  value: Number,
  timestamp: { type: Number, required: [true, "need timestamp"] },
  blocknumber: Number,
});

const EventPoint = mongoose.model("eventPoint", EventSchema);

module.exports = EventPoint;
