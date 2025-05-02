const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'https://coachingfinder1.vercel.app'] }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// Contact Schema
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

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  }
});

// Contact Form Handler
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send Email Notification
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: '📩 New Contact Submission - Coaching Finder',
      html: `
        <h3>New Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    res.status(201).json({ message: 'Form saved and email sent' });
  } catch (error) {
    console.error('❌ Contact Form Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google Places API
app.get('/api/places', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=establishment&keyword=coaching&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Places API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${process.env.ADMIN_SECRET}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin: Get Contacts
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('❌ Admin Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Admin: Delete Contact
app.delete('/api/admin/contact/:id', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});