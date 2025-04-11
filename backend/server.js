const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

// Load config
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport.js');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/panilagbe')
  .then(() => {
    console.log('MongoDB Connected');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Pani Lagbe API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
}); 