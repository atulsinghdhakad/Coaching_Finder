// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy institute data (this will be replaced with MongoDB data later if needed)
const institutes = [
  { id: 1, name: 'Aspirants Academy', city: 'Delhi', rating: 4.8 },
  { id: 2, name: 'Bright Future Classes', city: 'Mumbai', rating: 4.5 },
  { id: 3, name: 'Scholars Point', city: 'Bangalore', rating: 4.2 },
  { id: 4, name: 'Coaching Hub', city: 'Chennai', rating: 4.0 },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// API endpoint to get institutes
app.get('/api/institutes', (req, res) => {
  res.status(200).json(institutes);
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});
