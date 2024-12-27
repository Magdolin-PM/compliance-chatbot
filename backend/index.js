const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Adjust if the frontend is hosted elsewhere
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions)); // Enable CORS
console.log("CORS Options:", corsOptions); // Log CORS configuration

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log(`Request Headers:`, req.headers);
  console.log(`Request Body:`, req.body);
  next();
});

// Route Handling
app.use('/api', chatRoutes); // API routes
app.get('/', (req, res) => {
  res.send('Welcome to the Compliance Chatbot Backend!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
