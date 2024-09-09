// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'your-mongodb-connection-string-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Test Schema
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: Number, required: true }
}, { collection: 'tests' }); // Explicitly set the collection name

const Test = mongoose.model('Test', testSchema);

// GET request - Home route
app.get('/', (req, res) => {
  res.send('Hello from Render with MongoDB!');
});

// GET request - Retrieve all test documents
app.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching tests' });
  }
});

// POST request - Add a new test document
app.post('/tests', async (req, res) => {
  const { name, phone_number } = req.body;

  // Validation
  if (!name || phone_number === undefined) {
    return res.status(400).json({ error: 'Please provide name and phone number' });
  }

  const newTest = new Test({
    name,
    phone_number
  });

  try {
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving test document' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
