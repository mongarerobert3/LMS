const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Course.modules" },
  completed: { type: Boolean, default: false },
  score: { type: Number, min: 0, max: 100 },
  lastAccessed: { type: Date, default: Date.now },
});

const EnrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  progress: [ProgressSchema],
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
