const express = require("express");
const router = express.Router();
const { Course, Module } = require("../models/Course");

// Create a new course
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get course details by ID including modules
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get courses by instructor ID
router.get("/instructor/:instructorId", async (req, res) => {
  try {
    const courses = await Course.find({
      instructorId: req.params.instructorId,
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a course
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a module to a course
router.post("/:id/modules", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules.push(req.body);
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a specific module in a course
router.put("/:id/modules/:moduleId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const moduleIndex = course.modules.findIndex(
      (module) => module._id.toString() === req.params.moduleId
    );
    if (moduleIndex === -1) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Update module fields
    Object.keys(req.body).forEach((key) => {
      course.modules[moduleIndex][key] = req.body[key];
    });

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific module from a course
router.delete("/:id/modules/:moduleId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules = course.modules.filter(
      (module) => module._id.toString() !== req.params.moduleId
    );
    await course.save();

    res.json({ message: "Module deleted", course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
