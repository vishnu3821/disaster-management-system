const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://disaster-management-system-ten.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Disaster Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Mock auth endpoints for testing
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Mock successful registration
  res.json({
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: '1',
      name: name,
      email: email,
      role: role || 'user',
      location: '',
      phone: '',
      skills: []
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock successful login
  res.json({
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: '1',
      name: 'Test User',
      email: email,
      role: 'user',
      location: '',
      phone: '',
      skills: []
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
