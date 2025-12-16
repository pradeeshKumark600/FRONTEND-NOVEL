# ⚡ Quick Start Guide - Backend API

Get your backend API running in 3 minutes!

## 🏃 Super Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 3. Seed the database
npm run seed

# 4. Start the server
npm run dev
```

**That's it!** 🎉

Backend running on: http://localhost:5000

## 🧪 Test It

Open: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 🔑 Demo Login Credentials

Created by the seed script:

**Admin Account:**
- Email: `admin@theantamil.com`
- Password: `admin123`

**User Account:**
- Email: `demo@theantamil.com`
- Password: `demo123`

## 📱 Connect Frontend

Make sure your frontend `.env` has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then start frontend:
```bash
cd ..
npm run dev
```

## 🎯 What You Get

✅ Full RESTful API
✅ JWT Authentication
✅ User Management
✅ Novel & Chapter Management
✅ Reading Progress Tracking
✅ Bookmarks & Likes
✅ Search & Filter
✅ Sample Data Loaded

## 📚 API Endpoints

- Auth: `/api/auth/*`
- Novels: `/api/novels/*`
- Chapters: `/api/novels/:id/chapters/*`
- Reading Progress: `/api/reading/*`

See [README.md](README.md) for full documentation.

## 🐛 Troubleshooting

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Port 5000 already in use?**
Change `PORT` in `.env` file

**Need help?**
Read the full [README.md](README.md) or [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md)

---

**Ready to build something amazing! 🚀**
