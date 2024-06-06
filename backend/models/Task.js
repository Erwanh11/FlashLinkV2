const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['to-do', 'in-progress', 'done'], default: 'to-do' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
});
module.exports = mongoose.model('Task', taskSchema);
