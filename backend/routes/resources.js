const express = require("express");
const { Resource, ResourceProgress } = require("../models/Resource");

const router = express.Router();

// Middleware for checking if resource exists
const checkResourceExists = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }
    req.resource = resource;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @route   GET /api/resources
 * @desc    Get all resources with filtering
 * @access  Public/Private depending on resource access settings
 */
router.get("/", async (req, res) => {
  try {
    const {
      title,
      type,
      module,
      published,
      tags,
      limit = 20,
      page = 1,
      sort = "order",
    } = req.query;

    // Build query object
    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (type) query.type = type;
    if (module) query.module = module;
    // if (published !== undefined) query.isPublished = published === "true";
    if (tags) {
      // Handle comma-separated tags
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const resources = await Resource.find(query)
      .populate("module", "title")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      count: resources.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: resources,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/resources/:id
 * @desc    Get single resource by ID
 * @access  Public/Private depending on resource access
 */
router.get("/:id", checkResourceExists, async (req, res) => {
  try {
    // Get user ID from authenticated request if available
    const userId = req.user ? req.user.id : null;

    // If user is authenticated, include their progress
    let resource = req.resource;

    if (userId) {
      // Get progress info for this user and resource
      const progress = await ResourceProgress.findOne({
        user: userId,
        resource: resource._id,
      });

      // If no progress record exists, create one for "not_started"
      if (!progress && resource) {
        await ResourceProgress.create({
          user: userId,
          resource: resource._id,
          status: "not_started",
          lastAccessedAt: new Date(),
        });
      } else if (progress) {
        // Update last accessed time
        progress.lastAccessedAt = new Date();
        await progress.save();
      }

      // Get the resource with progress populated
      resource = await Resource.findById(req.params.id)
        .populate("module", "title order")
        .populate({
          path: "completionStatus",
          match: { user: userId },
        });
    } else {
      // Just get the resource without progress info
      resource = await Resource.findById(req.params.id).populate(
        "module",
        "title order"
      );
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/resources
 * @desc    Create new resource
 * @access  Private (Admin/Instructor)
 */
router.post("/", async (req, res) => {
  try {
    // If there's a userId from auth middleware
    if (req.user && req.user.id) {
      req.body.createdBy = req.user.id;
      req.body.updatedBy = req.user.id;
    }

    // Get the highest order value in the module and add 1
    if (req.body.module && !req.body.order) {
      const highestOrder = await Resource.findOne({ module: req.body.module })
        .sort("-order")
        .select("order");

      req.body.order = highestOrder ? highestOrder.order + 1 : 1;
    }

    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/resources/:id
 * @desc    Update resource
 * @access  Private (Admin/Instructor)
 */
router.put("/:id", checkResourceExists, async (req, res) => {
  try {
    // If there's a userId from auth middleware
    if (req.user && req.user.id) {
      req.body.updatedBy = req.user.id;
    }

    // Update resource with validation
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedResource,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete resource
 * @access  Private (Admin/Instructor)
 */
router.delete("/:id", checkResourceExists, async (req, res) => {
  try {
    await req.resource.remove();

    // Reorder remaining resources in the same module
    const module = req.resource.module;
    const deletedOrder = req.resource.order;

    // Find all resources in the same module with higher order
    // and decrement their order
    await Resource.updateMany(
      { module, order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    );

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/resources/reorder
 * @desc    Reorder resources within a module
 * @access  Private (Admin/Instructor)
 */
router.put("/reorder", async (req, res) => {
  try {
    const { moduleId, resourceOrders } = req.body;

    if (!moduleId || !resourceOrders || !Array.isArray(resourceOrders)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reorder data. Provide moduleId and resourceOrders array",
      });
    }

    // Validate all resources exist and belong to the module
    for (const item of resourceOrders) {
      const { id, order } = item;

      const resource = await Resource.findOne({ _id: id, module: moduleId });
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `Resource with ID ${id} not found in module ${moduleId}`,
        });
      }

      // Update the order
      await Resource.findByIdAndUpdate(id, { order });
    }

    // Get updated resources
    const updatedResources = await Resource.find({ module: moduleId }).sort(
      "order"
    );

    res.json({
      success: true,
      message: "Resources reordered successfully",
      data: updatedResources,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/resources/:id/progress
 * @desc    Update user progress for a resource
 * @access  Private (Authenticated users)
 */
router.post("/:id/progress", checkResourceExists, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to track progress",
      });
    }

    const userId = req.user.id;
    const resourceId = req.params.id;
    const { status, progress, timeSpent } = req.body;

    // Find existing progress or create new
    let resourceProgress = await ResourceProgress.findOne({
      user: userId,
      resource: resourceId,
    });

    if (!resourceProgress) {
      resourceProgress = new ResourceProgress({
        user: userId,
        resource: resourceId,
      });
    }

    // Update fields if provided
    if (status) resourceProgress.status = status;
    if (progress !== undefined) resourceProgress.progress = progress;
    if (timeSpent !== undefined) {
      resourceProgress.timeSpent =
        (resourceProgress.timeSpent || 0) + timeSpent;
    }

    // If completed, set completedAt
    if (status === "completed" && !resourceProgress.completedAt) {
      resourceProgress.completedAt = new Date();
      resourceProgress.progress = 100;
    }

    resourceProgress.lastAccessedAt = new Date();
    await resourceProgress.save();

    res.json({
      success: true,
      data: resourceProgress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/resources/module/:moduleId
 * @desc    Get all resources for a specific module
 * @access  Public/Private depending on module access
 */
router.get("/module/:moduleId", async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const userId = req.user ? req.user.id : null;

    // Get resources for this module
    let resources = await Resource.find({ module: moduleId }).sort("order");

    // If user is authenticated, include their progress
    if (userId) {
      // Get all progress records for this user and these resources
      const resourceIds = resources.map((r) => r._id);
      const progressRecords = await ResourceProgress.find({
        user: userId,
        resource: { $in: resourceIds },
      });

      // Create a map for quick lookup
      const progressMap = {};
      progressRecords.forEach((record) => {
        progressMap[record.resource.toString()] = record;
      });

      // Enhance resources with progress info
      resources = resources.map((resource) => {
        const resourceObj = resource.toObject();
        resourceObj.progress = progressMap[resource._id.toString()] || {
          status: "not_started",
          progress: 0,
        };
        return resourceObj;
      });
    }

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
