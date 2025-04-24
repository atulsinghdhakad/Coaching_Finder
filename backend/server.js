// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dummy institute data
const institutes = [
  { id: 1, name: 'Aspirants Academy', city: 'Delhi', rating: 4.8 },
  { id: 2, name: 'Bright Future Classes', city: 'Mumbai', rating: 4.5 },
  { id: 3, name: 'Scholars Point', city: 'Bangalore', rating: 4.2 },
  { id: 4, name: 'Coaching Hub', city: 'Chennai', rating: 4.0 },
];

// API endpoint to get institutes
app.get('/api/institutes', (req, res) => {
  res.status(200).json(institutes);
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});
