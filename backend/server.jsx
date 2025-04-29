const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001' }));



// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS;

// MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('MongoDB Error:', err));

// Mongo Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const Contact = mongoose.model('Contact', ContactSchema);

// Setup Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASS,
  }
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ✉️ Send Email
    await transporter.sendMail({
      from: SMTP_EMAIL,
      to: SMTP_EMAIL, // send to your own admin email
      subject: '📩 New Coaching Finder Contact Submission',
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    res.status(201).json({ message: 'Form saved and email sent' });

  } catch (error) {
    console.error('Error handling contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Places API
app.get('/api/places', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=establishment&keyword=coaching&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Places API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});




// Fetch all contacts for Admin
app.get('/api/admin/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });



// Simple Admin Auth Middleware
const adminAuth = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token === `Bearer ${process.env.ADMIN_SECRET}`) {
      next(); // ✅ Auth success
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };





  app.get('/api/admin/contacts', adminAuth, async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });


  app.delete('/api/admin/contact/:id', adminAuth, async (req, res) => {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete' });
    }
  });



// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});