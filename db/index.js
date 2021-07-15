const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/tutorial");
const EventPoint = require("./models/EventPoint");

module.exports = { EventPoint };
