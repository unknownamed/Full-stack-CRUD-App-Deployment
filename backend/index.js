// Updated to workaround DNS SRV blocked ISP
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/todos', todoRoutes);

// Root Endpoint for checking Server Status
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Todo App API' });
});

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
}

// Export the app for Vercel serverless functions
module.exports = app;
