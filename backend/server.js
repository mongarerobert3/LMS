require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// --- Middleware ---
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// --- Gemini Setup ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY not found in .env file.");
  process.exit(1); // Exit if API key is missing
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or choose another suitable model

// --- Routes ---

// Test Route
app.get('/', (req, res) => {
  res.send('LMS Backend is running!');
});

// Puzzle Generation Route (Placeholder)
app.get('/api/puzzle', async (req, res) => {
  console.log("Received request for /api/puzzle");
  try {
    // TODO: Implement prompt engineering to get Gemini to generate a crossword
    // in a structured format (grid, clues, answers). This is complex.
    // For now, return the static puzzle data.

    // Example prompt structure (needs significant refinement):
    const prompt = `Generate a 10x10 Bible-based crossword puzzle with 5 across and 5 down clues (mix of easy, medium, hard) covering Old/New Testament topics. Output ONLY a JSON object with keys: "grid" (10x10 array, 0 for block, 1 for letter), "clues" (object with "across" and "down" arrays, each containing objects with "num", "clue", "answer", "row", "col", "len"). Ensure answers fit the grid.`;

    console.log("Sending prompt to Gemini (simulation - returning static data for now)...");
    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const text = response.text();
    // const puzzleJson = JSON.parse(text); // This assumes Gemini returns perfect JSON

    // --- Returning Static Data ---
    const staticPuzzleData = {
      title: "Crossword of Faith",
      gridSize: 10,
      grid: [
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1], [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      clues: {
        across: [
          { num: 1, clue: "First book of the Bible (7)", answer: "GENESIS", row: 0, col: 2, len: 7 },
          { num: 3, clue: "He built an ark (4)", answer: "NOAH", row: 2, col: 0, len: 4 },
          { num: 5, clue: "Disciple who denied Jesus (5)", answer: "PETER", row: 4, col: 4, len: 5 },
          { num: 7, clue: "Location of the Ten Commandments (5)", answer: "SINAI", row: 6, col: 0, len: 5 },
          { num: 8, clue: "Shortest verse: 'Jesus ____' (4)", answer: "WEPT", row: 6, col: 7, len: 4 },
        ],
        down: [
          { num: 1, clue: "Garden where Adam and Eve lived (4)", answer: "EDEN", row: 0, col: 2, len: 4 },
          { num: 2, clue: "Mother of Jesus (4)", answer: "MARY", row: 0, col: 6, len: 4 },
          { num: 4, clue: "He fought Goliath (5)", answer: "DAVID", row: 2, col: 0, len: 5 },
          // Note: These last two clues/answers don't fit the static grid above and would need adjustment
          // { num: 6, clue: "Last book of the Bible (10)", answer: "REVELATION", row: 2, col: 9, len: 10 },
          // { num: 9, clue: "A type of prayer communication (10)", answer: "INTERCESSION", row: 0, col: 4, len: 10 },
        ],
      },
    };
     console.log("Returning static puzzle data.");
    res.json(staticPuzzleData);
    // --- End Static Data ---

  } catch (error) {
    console.error("Error generating puzzle:", error);
    res.status(500).json({ error: "Failed to generate puzzle" });
  }
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
