# 🎓 Coaching Finder

A modern, full-stack web application that helps users discover and connect with coaching institutes across different cities. Built with React, Node.js, MongoDB, and Firebase Authentication.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb)](https://mongodb.com/)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-000000?logo=vercel)](https://vercel.com/)
[![Firebase](https://img.shields.io/badge/firebase-FFCA28?logo=firebase)](https://firebase.google.com/)

---

## 🌐 Live Demo

- **Frontend:** [https://coaching-finder.vercel.app](https://coaching-finder.vercel.app)
- **Backend API:** [https://coaching-finder-api.onrender.com](https://coaching-finder-api.onrender.com)

---

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-provider Authentication:** Email/Password, Google OAuth, Phone Number
- **Profile Management:** Update profile picture, display name, and settings
- **Session Persistence:** Automatic login state management
- **Admin Panel:** Secure admin access with contact management

### 🏫 Institute Discovery
- **Location-based Search:** Find institutes by city and area
- **Advanced Filtering:** Filter by category, rating, and distance
- **Interactive Maps:** Google Places API integration
- **Detailed Profiles:** Comprehensive institute information

### 🎨 User Experience
- **Dark/Light Mode:** Toggle between themes with persistent preference
- **Responsive Design:** Optimized for desktop, tablet, and mobile
- **Smooth Animations:** Framer Motion powered transitions
- **Real-time Notifications:** Toast notifications for user feedback

### 📞 Contact & Communication
- **Contact Forms:** Easy communication with institutes
- **Admin Dashboard:** Manage and export contact submissions
- **Email Integration:** Automated email notifications
- **CSV Export:** Download contact data for analysis

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase Auth** - Authentication service
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Nodemailer** - Email service
- **dotenv** - Environment variables

### External Services
- **Firebase** - Authentication & Storage
- **Google Places API** - Location services
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

---

## 📁 Project Structure

```
Coaching_Finder-main/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route configurations
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── index.jsx        # Entry point
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── backend/                  # Node.js backend server
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
├── firebase-storage-rules.txt # Firebase security rules
├── vercel.json              # Vercel deployment config
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Google Places API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atulsinghdhakad/Coaching_Finder.git
   cd Coaching_Finder
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**

   **Frontend (.env in frontend directory):**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_GOOGLE_PLACES_API_KEY=your_google_places_api_key
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

   **Backend (.env in backend directory):**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ADMIN_EMAILS=admin1@example.com,admin2@example.com
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🔧 Available Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Backend
```bash
npm start          # Start production server
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Institutes
- `GET /api/institutes` - Get all institutes
- `GET /api/institutes/:id` - Get institute by ID
- `GET /api/institutes/search` - Search institutes

### Admin
- `GET /api/admin/contacts` - Get all contacts (admin only)
- `DELETE /api/admin/contacts/:id` - Delete contact (admin only)
- `POST /api/admin/contacts/export` - Export contacts to CSV

### Contact
- `POST /api/contact` - Submit contact form

---

## 🔐 Admin Access

To access the admin panel:

1. Register with an email address listed in `ADMIN_EMAILS` environment variable
2. Navigate to `/admin/login`
3. Use your registered email and password
4. Access admin dashboard at `/admin`

**Admin Features:**
- View all contact submissions
- Delete contact entries
- Export contact data to CSV
- Manage user data

---

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. Customize the design by modifying:
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/src/index.css` - Global styles
- Component-specific CSS files

### Firebase Configuration
Update Firebase settings in:
- `frontend/src/firebase.jsx` - Firebase initialization
- `firebase-storage-rules.txt` - Storage security rules

### Google Places API
Configure location services in:
- `frontend/src/utils/googlePlaces.jsx` - Places API integration

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy as a web service

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Firebase configuration
- MongoDB connection string
- Google Places API key
- Admin email addresses

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Atul Singh Dhakad**
- GitHub: [@atulsinghdhakad](https://github.com/atulsinghdhakad)
- LinkedIn: [Atul Singh Dhakad](https://linkedin.com/in/atulsinghdhakad)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Firebase](https://firebase.google.com/) - Authentication and hosting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Frontend deployment
- [Render](https://render.com/) - Backend deployment
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service) - Location services

---

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact: atuldhakad@example.com

---

**Made with ❤️ by Atul Singh Dhakad**

