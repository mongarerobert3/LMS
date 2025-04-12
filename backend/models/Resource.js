const mongoose = require("mongoose");
const mediaTypes = ["video", "document", "image", "link"];

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Resource title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Resource type is required"],
      enum: mediaTypes.concat(["text"]),
      default: "text",
    },
    content: { type: String, default: "" },
    media: {
      url: { type: String, trim: true },
      fileSize: { type: Number, default: 0 },
      mimeType: { type: String, trim: true },
      duration: { type: Number, default: 0 },
      dimensions: { width: Number, height: Number },
      thumbnail: { type: String, trim: true },
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module ID is required"],
    },
    order: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: true },
    estimatedTimeToComplete: { type: Number, default: 0 },
    accessRestriction: {
      type: String,
      enum: ["public", "registered", "enrolled"],
      default: "enrolled",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validation middleware
ResourceSchema.pre("validate", function (next) {
  const type = this.type;

  if (mediaTypes.includes(type) && !this.media.url) {
    this.invalidate("media.url", "URL is required for this resource type");
  }

  if (type === "text" && !this.content) {
    this.invalidate("content", "Content is required for text resources");
  }

  next();
});

// Virtual for tracking completion status (populated on query)
ResourceSchema.virtual("completionStatus", {
  ref: "ResourceProgress",
  localField: "_id",
  foreignField: "resource",
  justOne: true,
});

// Method to check if a resource has valid attributes based on its type
ResourceSchema.methods.hasValidTypeAttributes = function () {
  const type = this.type;

  if (type === "text" && !this.content) return false;

  if (mediaTypes.includes(type) && !this.media.url) return false;

  return true;
};

const ResourceProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    // progress: {
    //   type: Number,
    //   min: 0,
    //   max: 100,
    //   default: 0,
    // },
    lastAccessedAt: { type: Date },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexing
ResourceSchema.index({ module: 1, order: 1 });
ResourceSchema.index({ title: "text", description: "text", tags: "text" });
ResourceProgressSchema.index({ user: 1, resource: 1 }, { unique: true });

const ResourceProgress = mongoose.model(
  "ResourceProgress",
  ResourceProgressSchema
);

const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = { Resource, ResourceProgress };
