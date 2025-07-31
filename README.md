PookiePlaza is a modern love-sharing social platform built with the MERN stack and Stream Chat, designed to help couples celebrate their relationships, share special moments, and connect with other couples in a private, secure environment.

Key Features ✨
💑 Couple Profiles - Create joint profiles with your partner

📸 Memory Timeline - Share and cherish special moments

💬 Real-time Chat - Stream-powered private messaging

🎉 Anniversary Reminders - Never miss important dates

🔒 Secure Content - End-to-end encryption for private moments

🌟 Relationship Goals - Set and track milestones together

📱 Mobile Responsive - Works flawlessly on all devices

Tech Stack 🛠️
Frontend:

React 18

Vite

Tailwind CSS

Shadcn UI Components

Zustand State Management

Stream Chat SDK

Backend:

Node.js

Express

MongoDB (with Mongoose)

JWT Authentication

Socket.IO

Services:

Stream Chat API

Cloudinary (Media Storage)

Nodemailer (Email Notifications)

Installation Guide 📥
Prerequisites
Node.js 18+

MongoDB 6.0+

Stream Chat account

Setup Instructions
Clone the repository:

git clone https://github.com/Vinodbiradar09/PookiePlaza.git
cd PookiePlaza

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

Set up environment variables:
Create .env files in both server and client directories:

Server (.env):

env
MONGO_URI=mongodb://localhost:27017/pookieplaza
JWT_SECRET=your_jwt_secret_here
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Client (.env):

env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STREAM_API_KEY=your_stream_api_key
Run the application:
# Start the backend server
cd server
npm run dev

# Start the frontend
cd ../client
npm run dev
