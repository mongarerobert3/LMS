const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  position: { type: Number, required: true },
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'link'], required: true }
  }]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [ModuleSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
