#!/usr/bin/env node

// Railway start script - ensures backend runs correctly
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Railway backend server...');
console.log('Working directory:', process.cwd());
console.log('PORT:', process.env.PORT || '5001');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Change to backend directory and start the server
process.chdir(path.join(__dirname, 'backend'));
console.log('Changed to backend directory:', process.cwd());

// Start the simple server
const server = spawn('node', ['simple-server.js'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
