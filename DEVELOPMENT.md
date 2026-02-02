# TRA Blockchain Tax Administration System - Development Guide

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Mock Backend Server**

   ```bash
   node simple-server.js
   ```

   This will start the mock TRA API server on `http://localhost:3000`

3. **Start the Frontend Development Server**

   ```bash
   npm run dev
   ```

   This will start the React frontend on `http://localhost:5173`

4. **Login to the System**
   - Navigate to `http://localhost:5173/auth/login`
   - Use any username and password (e.g., `admin` / `password`)
   - The mock server will accept any credentials for development

## 🔧 Understanding the 403 Forbidden Error

### Problem

You were getting **403 Forbidden** errors because:

- The frontend was trying to connect to `http://localhost:3000`
- No backend server was running on that port
- API calls were failing with authentication errors

### Solution

We created a **Mock TRA API Server** that:

- ✅ Runs on `http://localhost:3000`
- ✅ Provides all the required API endpoints
- ✅ Handles authentication with mock tokens
- ✅ Returns realistic mock data for development

### API Endpoints Available

| Endpoint                         | Method | Description      | Auth Required |
| -------------------------------- | ------ | ---------------- | ------------- |
| `/api/health`                    | GET    | Health check     | No            |
| `/api/auth/login`                | POST   | Mock login       | No            |
| `/api/staff/me`                  | GET    | User info        | Yes           |
| `/api/compliance/dashboard`      | GET    | Compliance data  | Yes           |
| `/api/reports/revenue/dashboard` | GET    | Revenue data     | Yes           |
| `/api/blockchain/stats`          | GET    | Blockchain stats | Yes           |

## 🔐 Authentication Flow

1. **Login**: User enters credentials → Mock server returns JWT token
2. **Token Storage**: Token is stored in localStorage
3. **API Calls**: Frontend includes token in Authorization header
4. **Protected Routes**: All main routes require authentication
5. **Auto Redirect**: Unauthenticated users are redirected to login

## 📁 Project Structure

```
smat-tax-chain/
├── src/
│   ├── services/
│   │   ├── api.js              # Base API configuration
│   │   ├── authService.js      # Authentication service
│   │   └── traApiService.js    # TRA-specific API calls
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── routes/
│   │   ├── Router.js           # Main routing
│   │   └── ProtectedRoute.js   # Route protection
│   └── views/
│       └── authentication/     # Login/Register pages
├── simple-server.js            # Mock backend server
├── server.js                   # Express server (alternative)
└── package.json
```

## 🛠️ Development Workflow

### Frontend Development

1. Start the mock server: `node simple-server.js`
2. Start the frontend: `npm run dev`
3. Make changes to React components
4. Test API integration with mock data

### Backend Integration

When ready to connect to a real backend:

1. Update `src/services/api.js` with your backend URL
2. Update `src/services/traApiService.js` with real endpoints
3. Implement proper authentication in your backend
4. Remove the mock server

## 🐛 Troubleshooting

### Common Issues

**403 Forbidden Errors**

- ✅ **Solution**: Start the mock server with `node simple-server.js`
- ✅ **Verify**: Check `http://localhost:3000/api/health`

**Authentication Issues**

- ✅ **Solution**: Login through `/auth/login` with any credentials
- ✅ **Verify**: Check browser localStorage for auth token

**CORS Errors**

- ✅ **Solution**: Mock server includes CORS headers
- ✅ **Verify**: Check browser network tab for CORS issues

**Port Conflicts**

- ✅ **Solution**: Kill processes on port 3000: `lsof -ti:3000 | xargs kill -9`
- ✅ **Alternative**: Change port in `simple-server.js`

## 📊 Mock Data

The mock server provides realistic data for:

- **Compliance Dashboard**: Taxpayer compliance metrics
- **Revenue Dashboard**: Tax revenue statistics
- **Blockchain Stats**: Blockchain transaction data
- **User Management**: Mock user profiles

## 🔄 Next Steps

1. **Backend Development**: Build a real TRA API server
2. **Database Integration**: Connect to real tax databases
3. **Blockchain Integration**: Implement real blockchain features
4. **Production Deployment**: Deploy to production environment

## 📞 Support

For development issues:

1. Check the browser console for errors
2. Verify the mock server is running
3. Check network requests in browser dev tools
4. Ensure authentication tokens are present

---

**Note**: This is a development setup. For production, replace the mock server with a real TRA API backend.
