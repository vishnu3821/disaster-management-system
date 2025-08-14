# Disaster Management System

A comprehensive disaster management system built with React (frontend) and Node.js/Express (backend).

## Features

- **User Authentication**: Secure login and registration system
- **Disaster Reporting**: Users can report disasters with location and details
- **Admin Dashboard**: Administrative interface for managing disasters and users
- **Volunteer Management**: Coordinate volunteer efforts
- **Real-time Notifications**: Stay updated with disaster alerts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MySQL/Sequelize for database
- JWT for authentication
- Cloudinary for image uploads
- Socket.io for real-time features

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd disaster-management-system
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
```bash
# Copy the example env file in backend directory
cp backend/env.example backend/.env
# Fill in your database and API credentials
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
npm run dev
```

## Deployment

### Frontend (Vercel)
- The frontend is configured for Vercel deployment
- Simply connect your GitHub repository to Vercel

### Backend
- Can be deployed to platforms like Railway, Render, or Heroku
- Ensure environment variables are properly configured

## Environment Variables

See `backend/env.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
