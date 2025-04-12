const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for checking if user exists
const checkUserExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Add user to request object for later use
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @route   GET /api/users
 * @desc    Get all users with optional filtering
 * @access  Public/Private (depending on your requirements)
 */
router.get("/", async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      limit = 10,
      page = 1,
      sort = "createdAt",
    } = req.query;

    // Build query object
    const query = {};

    // Add filters if provided
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = users.length;

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public/Private
 */
router.get("/:id", checkUserExists, (req, res) => {
  res.json(req.user);
});

/**
 * @route   PATCH /api/users/:id
 * @desc    Partial update a user
 * @access  Private
 */
router.patch("/:id", checkUserExists, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/users/search
 * @desc    Advanced search with multiple parameters
 * @access  Private
 */
router.get("/search", async (req, res) => {
  try {
    // Get all query parameters
    const {
      name,
      email,
      role,
      createdAfter,
      createdBefore,
      minAge,
      maxAge,
      status,
      limit = 10,
      page = 1,
      sort = "createdAt",
    } = req.query;

    // Build advanced query
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (role) query.role = role;
    if (status) query.status = status;

    // Date range query
    if (createdAfter || createdBefore) {
      query.createdAt = {};
      if (createdAfter) query.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) query.createdAt.$lte = new Date(createdBefore);
    }

    // Age range query (assuming you store date of birth)
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
