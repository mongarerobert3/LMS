const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Get all enrollments for a course (for instructor dashboard)
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate('studentId', 'name email avatar')
      .populate('courseId', 'title');
      
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student progress in a course
router.get('/student/:studentId/course/:courseId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      studentId: req.params.studentId,
      courseId: req.params.courseId
    }).populate('courseId', 'title modules');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student progress (mark module as completed)
router.patch('/:enrollmentId/progress', async (req, res) => {
  try {
    const { moduleId, completed, score } = req.body;
    
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update or add progress for the module
    const progressIndex = enrollment.progress.findIndex(
      p => p.moduleId.toString() === moduleId
    );
    
    if (progressIndex >= 0) {
      enrollment.progress[progressIndex].completed = completed;
      if (score !== undefined) {
        enrollment.progress[progressIndex].score = score;
      }
      enrollment.progress[progressIndex].lastAccessed = new Date();
    } else {
      enrollment.progress.push({
        moduleId,
        completed,
        score,
        lastAccessed: new Date()
      });
    }
    
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
