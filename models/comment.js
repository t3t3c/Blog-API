const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  timestamp: { type: Date, default: Date.now },
});

// username, content, timestamp, blog

module.exports = mongoose.model('Comment', commentSchema);
