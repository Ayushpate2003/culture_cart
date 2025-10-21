# CultureCart Security Documentation

## Admin User Management

### Security Model

CultureCart implements a **single-admin security model** where:
- Only **ONE** administrator account is allowed per system
- Admin privileges **cannot** be granted through the web interface
- Admin promotion requires secure server-side processes

### Admin Initialization (First Time Setup)

#### Method 1: Firebase Console (Recommended)
1. Create a regular user account through the signup page
2. Go to [Firebase Console](https://console.firebase.google.com)
3. Navigate to **Firestore Database**
4. Find the `users` collection
5. Locate your user document
6. Edit the document:
   - Change `role` from `"user"` to `"admin"`
   - Add field `isFirstAdmin: true`
7. Save changes
8. Refresh the application

#### Method 2: Firebase Functions (Production)
```javascript
// Deploy this as a Firebase Function with admin privileges
const { initializeFirstAdmin } = require('./utils/adminInit');

exports.setupAdmin = functions.https.onCall(async (data, context) => {
  // Add authentication checks here
  return await initializeFirstAdmin({
    uid: data.uid,
    email: data.email,
    displayName: data.displayName
  });
});
```

#### Method 3: Server-Side Script
```javascript
// Use Firebase Admin SDK
const admin = require('firebase-admin');
const { initializeFirstAdmin } = require('./utils/adminInit');

// Initialize with service account
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// Create first admin
await initializeFirstAdmin({
  uid: 'user-uid-here',
  email: 'admin@example.com',
  displayName: 'System Administrator'
});
```

### Security Features Implemented

#### 1. Self-Promotion Prevention
- Users cannot promote themselves to admin role
- `updateUserRole()` function blocks admin promotion attempts
- Error thrown: `"Unauthorized: Cannot promote to admin role"`

#### 2. Route Protection
- All admin routes require `requireAdmin` prop in `ProtectedRoute`
- Admin dashboard accessible only to verified admin users
- Unauthorized access redirects to login

#### 3. Client-Side Validation
- Admin status checked via `isAdmin()` function
- User profile role verified against Firestore
- Local storage fallback with same restrictions

#### 4. Insecure Functions Disabled
- `promoteUserToAdmin()` function deprecated and disabled
- Admin setup routes removed from public access
- Console warnings for deprecated functions

### Security Checklist

- [ ] First admin created through secure method
- [ ] Admin setup routes removed from production
- [ ] Firestore security rules configured
- [ ] Server-side validation implemented
- [ ] Admin operations logged
- [ ] Regular security audits scheduled

### Firestore Security Rules

Add these rules to your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Prevent role escalation to admin
      allow update: if request.auth != null 
        && request.auth.uid == userId 
        && (!('role' in request.resource.data) || request.resource.data.role != 'admin');
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Monitoring and Auditing

#### Admin Actions to Monitor
- User role changes
- Admin dashboard access
- Sensitive data modifications
- Failed authorization attempts

#### Logging Implementation
```javascript
// Log admin actions
const logAdminAction = async (adminUid, action, target, details) => {
  await addDoc(collection(db, 'admin_logs'), {
    adminUid,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
    ip: getClientIP(), // Implement IP detection
    userAgent: navigator.userAgent
  });
};
```

### Emergency Procedures

#### If Admin Account is Compromised
1. Immediately disable the account in Firebase Authentication
2. Review admin logs for unauthorized actions
3. Create new admin account through secure method
4. Audit all recent changes
5. Update security measures

#### If No Admin Access
1. Use Firebase Console to manually update user role
2. Deploy Firebase Function with admin privileges
3. Use Firebase Admin SDK from server environment
4. Contact Firebase support if needed

### Development vs Production

#### Development Environment
- Local admin storage allowed for testing
- Console warnings for insecure operations
- Admin setup instructions displayed

#### Production Environment
- Remove all development admin utilities
- Implement server-side admin management
- Enable comprehensive logging
- Regular security audits

---

**⚠️ Important**: Never expose admin creation functions to client-side code in production environments.
