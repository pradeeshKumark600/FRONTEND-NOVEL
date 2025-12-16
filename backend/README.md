# Theantamil Amuthu Novels - Backend API

Complete RESTful API backend for the Tamil novels reading platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Novel Management**: CRUD operations for novels and chapters
- **Reading Progress**: Track user reading progress across novels
- **Bookmarks & Likes**: User engagement features
- **Multi-language Support**: Tamil and English content support
- **Search & Filter**: Advanced novel search and filtering
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Error Handling**: Comprehensive error handling middleware

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/theantamil-novels
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

## 📊 Database Setup

1. **Make sure MongoDB is running:**
   ```bash
   # For Windows (if MongoDB is installed as a service):
   net start MongoDB

   # For macOS/Linux:
   sudo systemctl start mongod
   ```

2. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

   This will create:
   - Demo users (admin and regular user)
   - Sample novels
   - Sample chapters

   **Demo Login Credentials:**
   - Admin: `admin@theantamil.com` / `admin123`
   - User: `demo@theantamil.com` / `demo123`

## 🏃‍♂️ Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication & User
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token (Protected)
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)

### Novels
- `GET /api/novels` - Get all novels
- `GET /api/novels/:id` - Get novel by ID
- `GET /api/novels/slug?slug=novel-slug` - Get novel by slug
- `GET /api/novels/ratsasane-enai-vathaippathena` - Get specific novel
- `GET /api/novels/genre?genre=Romance` - Get novels by genre
- `GET /api/novels/author?author=thenmozhi` - Get novels by author
- `GET /api/novels/search?query=keyword` - Search novels
- `POST /api/novels/bookmark` - Bookmark a novel (Protected)
- `DELETE /api/novels/bookmark` - Remove bookmark (Protected)
- `POST /api/novels/like` - Like/unlike a novel (Protected)

### Chapters
- `GET /api/novels/:id/chapters` - Get all chapters for a novel
- `GET /api/novels/:novelId/chapters/:chapterId` - Get specific chapter
- `GET /api/novels/:novelId/chapters/number/:chapterNumber` - Get chapter by number

### Reading Progress
- `GET /api/reading/progress` - Get reading progress (Protected)
- `GET /api/reading/progress?novelId=xxx` - Get progress for specific novel (Protected)
- `POST /api/reading/progress` - Update reading progress (Protected)
- `POST /api/reading/progress/complete-chapter` - Mark chapter as completed (Protected)
- `DELETE /api/reading/progress/:novelId` - Delete reading progress (Protected)

### Health Check
- `GET /health` - Server health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Making Authenticated Requests:

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Token Refresh Flow:

1. Use access token for API requests
2. When access token expires, use refresh token to get new access token:
   ```bash
   POST /api/auth/refresh
   {
     "refreshToken": "<your-refresh-token>"
   }
   ```

## 📝 Example API Usage

### Register a User:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Novels:
```bash
curl http://localhost:5000/api/novels
```

### Update Reading Progress (Protected):
```bash
curl -X POST http://localhost:5000/api/reading/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "novelId": "<novel-id>",
    "chapterId": "<chapter-id>",
    "progress": 45
  }'
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── constants.js       # App constants
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── novelController.js # Novel logic
│   │   ├── chapterController.js # Chapter logic
│   │   └── readingProgressController.js
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   ├── errorHandler.js    # Error handling
│   │   └── validator.js       # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Novel.js           # Novel schema
│   │   ├── Chapter.js         # Chapter schema
│   │   └── ReadingProgress.js # Progress schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── novelRoutes.js     # Novel routes
│   │   ├── chapterRoutes.js   # Chapter routes
│   │   └── readingProgressRoutes.js
│   ├── utils/
│   │   ├── jwtUtils.js        # JWT helpers
│   │   └── seedDatabase.js    # DB seeding script
│   └── server.js              # Main server file
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: express-validator
- **Password Hashing**: bcryptjs
- **JWT Authentication**: Secure token-based auth

## 🛡️ Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

## 🧪 Testing

You can test the API using:
- **Postman**: Import the endpoints
- **cURL**: Use command-line examples above
- **Thunder Client**: VS Code extension
- **Frontend**: Connect to your React frontend

## 📦 Dependencies

### Core:
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing

### Middleware:
- **cors**: CORS handling
- **helmet**: Security headers
- **morgan**: HTTP logger
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation

### Development:
- **nodemon**: Auto-restart server
- **dotenv**: Environment variables

## 🔧 Troubleshooting

### MongoDB Connection Error:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB service is started

### Port Already in Use:
- Change `PORT` in `.env`
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### JWT Token Errors:
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiry settings
- Verify token is sent in Authorization header

## 🚀 Deployment

### Environment Setup:
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production MongoDB URI
4. Set appropriate CORS origins
5. Enable HTTPS

### Recommended Platforms:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS EC2**

## 📄 License

ISC

## 👥 Support

For issues or questions, please create an issue on GitHub.

---

**Built with ❤️ for Tamil literature lovers**
