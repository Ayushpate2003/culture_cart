# Culture Cart Backend API Documentation

## Authentication System

This backend provides a comprehensive authentication system with separate login flows for users and admins, with data stored in MongoDB.

### Features

- **User Registration & Login**: Regular users can register and login
- **Admin Login**: Dedicated admin authentication
- **Password Validation**: Strong password requirements
- **JWT Tokens**: Secure token-based authentication
- **Session Tracking**: Login/logout session tracking
- **Role-based Access Control**: Different access levels for users, artisans, and admins
- **Input Validation & Sanitization**: Secure input handling
- **MongoDB Integration**: All data stored in MongoDB

## API Endpoints

### User Authentication

#### 1. User Registration
```
POST /api/users/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user" // optional, defaults to "user"
}
```

**Response (Success):**
```json
{
  "success": true,
  "msg": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. User Login
```
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "msg": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "artisanProfile": {}
  }
}
```

#### 3. User Logout
```
POST /api/users/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "msg": "Logged out successfully"
}
```

#### 4. Get User Profile
```
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "artisanProfile": {
      "firstName": "John",
      "lastName": "Doe",
      "location": "New York",
      "craftType": "Pottery",
      "experienceYears": 5,
      "bio": "Professional potter...",
      "avatarUrl": "/uploads/avatar.jpg",
      "galleryImages": ["/uploads/gallery1.jpg"],
      "completedPercent": 80
    }
  }
}
```

### Admin Authentication

#### 1. Admin Login
```
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@culturecart.com",
  "password": "Admin@12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "msg": "Admin login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "username": "admin",
    "email": "admin@culturecart.com",
    "role": "admin"
  }
}
```

#### 2. Get Admin Profile
```
GET /api/admin/me
Authorization: Bearer <admin_token>
```

#### 3. Admin Logout
```
POST /api/admin/logout
Authorization: Bearer <admin_token>
```

#### 4. Admin Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "stats": {
      "totalUsers": 150,
      "totalArtisans": 25,
      "totalAdmins": 3,
      "totalUsers": 178
    },
    "recentSessions": [...]
  }
}
```

## Password Requirements

Passwords must meet the following criteria:
- At least 8 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*()_+-=[]{}|;':",./<>?)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "msg": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"] // optional
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token/credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin', 'artisan'], default: 'user'),
  artisanProfile: {
    firstName: String,
    lastName: String,
    location: String,
    craftType: String,
    experienceYears: Number,
    bio: String,
    avatarUrl: String,
    galleryImages: [String],
    completedPercent: Number
  }
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: ['login', 'logout', 'admin_login', 'admin_logout']),
  userAgent: String,
  ip: String,
  createdAt: Date
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/culture_cart
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5001
NODE_ENV=development
ADMIN_EMAIL=admin@culturecart.com
ADMIN_PASSWORD=Admin@12345
CORS_ORIGIN=http://localhost:3000
SESSION_EXPIRY=7d
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env` file

3. **Start the Server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   - Use Postman, curl, or any HTTP client
   - Start with user registration or admin login

## Default Admin Account

A default admin account is automatically created on server startup:
- **Email:** admin@culturecart.com
- **Password:** Admin@12345

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- Session tracking
- CORS protection
- Environment variable configuration

## Frontend Integration

The frontend should:
1. Store JWT tokens in localStorage or secure storage
2. Include tokens in Authorization headers for protected routes
3. Handle token expiration and refresh
4. Implement proper error handling for authentication failures
5. Redirect to login on 401 responses
