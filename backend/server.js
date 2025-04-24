const mongoose = require('mongoose');
require('dotenv').config(); // Make sure you're loading the .env file

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connection successful');
})
.catch((err) => {
  console.log('❌ MongoDB connection error:', err);
});
