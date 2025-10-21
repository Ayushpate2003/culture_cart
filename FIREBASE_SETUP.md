# Firebase Setup Instructions for CultureCart

## Quick Fix for Admin Access

If you're seeing Firebase errors and can't access admin features, you can use **Local Mode** which works without Firebase configuration:

### Option 1: Local Mode (Immediate Fix)
1. Navigate to `/admin-setup` in your browser
2. Sign up or log in with any account
3. Click "Promote Me to Admin (Local Mode)"
4. Refresh the page
5. You should now see admin features at `/admin-dashboard`

### Option 2: Full Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing one
   - Enable Authentication and Firestore Database

2. **Get Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the Firebase config object

3. **Set Environment Variables**
   - Copy `.env.example` to `.env` in your project root
   - Fill in the values from your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firestore Rules**
   - Go to Firestore Database > Rules
   - Replace with these rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           (request.auth.uid == userId || 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
       }
     }
   }
   ```

5. **Enable Authentication Methods**
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google (if desired)

6. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Admin Routes

Once you have admin access, you can visit:
- `/admin-dashboard` - Main admin dashboard
- `/admin/user-management` - User management interface
- `/admin/analytics` - Analytics dashboard
- `/admin/add-product` - Add new products
- `/admin/add-artisan` - Add new artisans
- `/admin/view-orders` - View and manage orders

## Troubleshooting

### "Missing or insufficient permissions" error
- Check Firestore rules are properly configured
- Ensure user is authenticated
- Try using Local Mode as fallback

### "Failed to load resource" error
- Check internet connection
- Verify Firebase project is active
- Check environment variables are correct

### Admin features not visible
- Ensure user role is set to 'admin'
- Try refreshing the page
- Check browser console for errors
- Use `/admin-setup` to promote user to admin

## Local Mode Features

When Firebase is not available, the app runs in Local Mode with:
- ✅ User authentication (session-based)
- ✅ Admin role management (localStorage)
- ✅ All admin UI features
- ❌ Data persistence across sessions
- ❌ Multi-device synchronization

This is perfect for development and testing!
