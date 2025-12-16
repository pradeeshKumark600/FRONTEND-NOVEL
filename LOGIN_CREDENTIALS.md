# 🔐 Login Credentials for Testing

## ✅ Mock User Accounts (For Testing)

The system now has **role-based authentication** with mock users. Use these credentials to test different access levels:

---

## 👑 ADMIN USER (Full Access)

**Email:** `admin@example.com`
**Password:** `admin123`
**Role:** ADMIN
**Access:** ✅ Can access Admin Dashboard

### What Admin Can Do:
- ✅ Access `/admin/dashboard`
- ✅ Manage novels (create, edit, delete)
- ✅ Manage chapters (create, edit, delete)
- ✅ View notifications
- ✅ Full admin panel access

---

## ✏️ EDITOR USER (Full Access)

**Email:** `editor@example.com`
**Password:** `editor123`
**Role:** EDITOR
**Access:** ✅ Can access Admin Dashboard

### What Editor Can Do:
- ✅ Access `/admin/dashboard`
- ✅ Manage novels (create, edit, delete)
- ✅ Manage chapters (create, edit, delete)
- ✅ View notifications
- ✅ Full admin panel access

---

## 👤 REGULAR USER (No Admin Access)

**Email:** `user@example.com`
**Password:** `user123`
**Role:** USER
**Access:** ❌ Cannot access Admin Dashboard

### What Regular User Can Do:
- ✅ Browse novels
- ✅ Read chapters
- ✅ Use public features
- ❌ **Cannot access** `/admin/*` routes
- ❌ Gets redirected to **403 Forbidden** page

---

## 🚀 How to Login

### Step 1: Go to Your App
```
http://localhost:5173/novels
```

### Step 2: Click Login Icon
- Look for the login/user icon in the header (top-right)
- Click it to open the login modal

### Step 3: Enter Credentials
Choose one of the accounts above and enter:
- **Email**
- **Password**

### Step 4: Click "Login"
Submit the form

### Step 5: Access Admin Dashboard
**For ADMIN/EDITOR users:**
```
http://localhost:5173/admin/dashboard
```
✅ You'll see the full admin panel!

**For REGULAR users:**
```
http://localhost:5173/admin/dashboard
```
❌ You'll be redirected to `/403` (Access Forbidden)

---

## 🎯 Testing Scenarios

### ✅ Test 1: Admin Login Success
1. Login with `admin@example.com` / `admin123`
2. Navigate to `/admin/dashboard`
3. **Expected:** Dashboard loads successfully

### ✅ Test 2: Editor Login Success
1. Login with `editor@example.com` / `editor123`
2. Navigate to `/admin/dashboard`
3. **Expected:** Dashboard loads successfully

### ❌ Test 3: Regular User Blocked
1. Login with `user@example.com` / `user123`
2. Navigate to `/admin/dashboard`
3. **Expected:** Redirected to `/403` (Forbidden page)

### ❌ Test 4: No Login Blocked
1. Don't login (or logout first)
2. Navigate to `/admin/dashboard`
3. **Expected:** Redirected to `/novels` page

### ❌ Test 5: Wrong Credentials
1. Try to login with wrong email/password
2. **Expected:** Error message: "Invalid email or password"

---

## 🔄 How It Works

### Authentication Flow:

```
User enters credentials
      ↓
authService.login() called
      ↓
Backend unavailable? → Use MOCK LOGIN
      ↓
Check MOCK_USERS array
      ↓
Match found? → Generate mock token + Store user with ROLE
      ↓
User navigates to /admin/dashboard
      ↓
RoleProtectedRoute checks:
  1. Is user authenticated? (has token?)
  2. Does user have role ADMIN or EDITOR?
      ↓
  ┌─────┴─────┐
YES            NO
  │             │
  ↓             ↓
ALLOW       REDIRECT
ACCESS      to /403
```

---

## 📝 Important Notes

### Mock Authentication:
- ✅ Works **without backend** running
- ✅ Uses in-memory user list (MOCK_USERS)
- ✅ Generates fake JWT tokens
- ✅ Stores role in localStorage
- ⚠️ **Remove in production** - Use real backend

### Role Storage:
User object stored in localStorage includes:
```javascript
{
  id: 1,
  email: "admin@example.com",
  role: "ADMIN",  // ← This is checked for access
  name: "Admin User"
}
```

### Token Storage:
```javascript
localStorage.setItem('authToken', 'mock-jwt-token-...');
localStorage.setItem('user', JSON.stringify(userData));
```

---

## 🛠️ Customization

### Add More Mock Users

Edit `src/services/API/authService.js` (lines 7-29):

```javascript
const MOCK_USERS = [
  // Add your custom user here
  {
    id: 4,
    email: 'yourname@example.com',
    password: 'yourpassword',
    role: 'ADMIN', // or 'EDITOR' or 'USER'
    name: 'Your Name'
  }
];
```

### Change Allowed Roles

Edit `src/routes/routes.jsx` (line 49):

```javascript
<RoleProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
  {/* Add or remove roles here */}
</RoleProtectedRoute>
```

---

## 🔧 Troubleshooting

### Issue: "Invalid email or password"
**Solution:** Make sure you're using the exact credentials from above (case-sensitive)

### Issue: Still redirected after admin login
**Solution:**
1. Check browser console for errors
2. Verify `DEVELOPMENT_MODE = false` in RoleProtectedRoute.jsx
3. Check localStorage: `localStorage.getItem('user')` should show role

### Issue: Backend errors in console
**Solution:** Ignore them! The mock login works when backend is unavailable

---

## ✅ Quick Test Commands (Browser Console)

**Check current user:**
```javascript
JSON.parse(localStorage.getItem('user'))
```

**Check auth token:**
```javascript
localStorage.getItem('authToken')
```

**Check user role:**
```javascript
JSON.parse(localStorage.getItem('user')).role
```

**Logout (clear auth):**
```javascript
localStorage.clear();
location.reload();
```

---

## 🎉 Summary

| Credential | Role | Admin Access | Password |
|------------|------|--------------|----------|
| `admin@example.com` | ADMIN | ✅ Yes | `admin123` |
| `editor@example.com` | EDITOR | ✅ Yes | `editor123` |
| `user@example.com` | USER | ❌ No (403) | `user123` |

**Enjoy testing your role-based admin dashboard!** 🚀
