# Deployment Guide

## Issues Fixed

### 1. Login Page Redirect Issue
- **Problem**: When opening `http://localhost:5176`, it was redirecting to login page instead of showing home page
- **Root Cause**: API response interceptor was redirecting to login on 401 errors even on public pages
- **Fix**: Modified API interceptor to only redirect to login on protected pages

### 2. Logout Redirect Issue  
- **Problem**: Logout was redirecting to login page instead of home page
- **Fix**: Changed logout redirects to go to home page (`/`) instead of login page

### 3. API Call Issues on Home Page
- **Problem**: Home page was making API calls that could cause 401 errors
- **Fix**: Added better error handling for 401 errors on public pages

## Deployment Steps

### Frontend Deployment (Vercel/Netlify)

1. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. **Build Command**:
   ```bash
   npm run build
   ```

3. **Deploy Settings**:
   - Build output directory: `dist`
   - Install command: `npm install`

### Backend Deployment (Railway/Render/Heroku)

1. **Environment Variables**:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

2. **Start Command**:
   ```bash
   npm start
   ```

3. **Build Command** (if needed):
   ```bash
   npm install
   ```

## Key Changes Made

### 1. API Response Interceptor (`frontend/src/services/api.js`)
```javascript
// Only redirect to login if we're not already on a public page
const publicPages = ['/', '/login', '/register', '/contact'];
const currentPath = window.location.pathname;
if (!publicPages.includes(currentPath)) {
    window.location.href = '/login';
}
```

### 2. Logout Redirects
- **DoctorDash.jsx**: Changed from `/login` to `/`
- **BookDoc.jsx**: Changed from `/login` to `/`
- **Sidebar.jsx**: Already correctly redirects to `/`

### 3. Error Handling
- **Doctor.jsx**: Added better error handling for 401 errors
- **PatientDashboard.jsx**: Fixed appointment fetching with correct API endpoint

## Testing Before Deployment

1. **Home Page**: Should load without redirecting to login
2. **Login**: Should work correctly and redirect to appropriate dashboard
3. **Logout**: Should redirect to home page, not login page
4. **Appointment Booking**: Should work without 401 errors
5. **Patient Dashboard**: Should show updated appointment list after booking

## Post-Deployment Checklist

- [ ] Home page loads correctly
- [ ] Login/logout works properly
- [ ] Appointment booking works
- [ ] Patient dashboard updates correctly
- [ ] Doctor dashboard works
- [ ] All API endpoints respond correctly
- [ ] Images load properly
- [ ] No console errors

## Troubleshooting

### If home page still redirects to login:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check if API calls are being made unnecessarily
4. Clear browser cache and localStorage

### If logout doesn't work properly:
1. Check if localStorage is being cleared
2. Verify navigation is working correctly
3. Check for any remaining authentication checks

### If API calls fail:
1. Verify backend URL is correct
2. Check CORS settings on backend
3. Verify environment variables are set correctly 