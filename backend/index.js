require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Check only for required environment variables
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is required in .env file");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  let mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/eduverse";

  //   if (process.env.NODE_ENV === 'development') {
  //     const { MongoMemoryServer } = require('mongodb-memory-server');
  //     const mongod = await MongoMemoryServer.create();
  //     mongoUri = mongod.getUri();
  //   }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

connectToDatabase().catch((err) =>
  console.error("MongoDB connection error:", err)
);

// Health checl
app.get("/", (req, res) => {
  res.send("OK");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/resources", require("./routes/resources"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
