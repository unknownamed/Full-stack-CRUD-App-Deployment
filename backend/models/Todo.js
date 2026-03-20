const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt Automatically
});

module.exports = mongoose.model('Todo', todoSchema);
