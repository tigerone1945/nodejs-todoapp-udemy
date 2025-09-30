const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'タスク名は必須です'],
    trim: true,
    maxlength: [20, 'タスク名は20文字以内で入力してください'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Task', TaskSchema);