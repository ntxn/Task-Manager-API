const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide a task description'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'A task has to have an owner'],
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
