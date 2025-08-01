 const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  messageId: String,
  from: String,
  to: [String],
  subject: String,
  date: Date,
  text: String,
  // html: String,
  notified: {
  type: Boolean,
  default: false,
},
  account: String,
  category: { type: String, default: '' }
});

module.exports = mongoose.model("Email", emailSchema);
