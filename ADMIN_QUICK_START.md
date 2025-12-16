# 🚀 Admin Dashboard - Quick Start Guide

## Access the Dashboard

### Development Testing (With Mock Data)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin dashboard:**
   ```
   http://localhost:5173/admin/dashboard
   ```

3. **What you'll see:**
   - The RoleProtectedRoute will simulate an ADMIN role (line 39 in RoleProtectedRoute.jsx)
   - Dashboard with mock statistics
   - Fully functional navigation

---

## Key Files to Know

### 🎯 Integration Points

**1. Role Check (MUST UPDATE FOR PRODUCTION)**
```javascript
File: src/components/common/RoleProtectedRoute/RoleProtectedRoute.jsx
Line: 39

// CURRENT (Mock):
const userRole = user.role || 'ADMIN';

// CHANGE TO:
const userRole = user.role;
```

**2. API Service (ALL MOCK FUNCTIONS)**
```javascript
File: src/services/API/adminMockService.js

Replace all functions with real API calls.
Search for "// TODO: Replace with real API call"
```

---

## Admin Routes Available

```
/admin/dashboard           → Overview with stats
/admin/novels              → List all novels
/admin/novels/create       → Create new novel
/admin/novels/edit/:id     → Edit existing novel
/admin/chapters            → List chapters (select novel first)
/admin/chapters/create     → Create new chapter
/admin/chapters/edit/:id   → Edit existing chapter
/admin/notifications       → View notifications
/403                       → Access forbidden page
```

---

## Quick Test Checklist

- [ ] Navigate to `/admin/dashboard` - See stats
- [ ] Click "Novels" in sidebar - See novel list
- [ ] Click "Create Novel" - See form
- [ ] Fill form and submit - See success message
- [ ] Click "Edit" on a novel - Form pre-filled
- [ ] Click "Chapters" in sidebar - See dropdown
- [ ] Select a novel - See chapter list
- [ ] Test mobile view - Hamburger menu works
- [ ] Click profile dropdown - See logout option

---

## Common First Steps

### Add a Real Admin User

**Backend (NestJS):** Ensure your JWT payload includes `role`:
```typescript
// In your auth service
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role  // Add this
};
```

**Frontend:** Verify `user.role` is available in AuthContext.

### Replace First API Call

**Example: Dashboard Stats**

**Before (Mock):**
```javascript
// In src/services/API/adminMockService.js
export const getDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, data: { ... } };
};
```

**After (Real):**
```javascript
import apiClient from './client';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};
```

---

## Styling Customization

All styles use SCSS modules. To customize:

**Colors:**
```scss
// In any .module.scss file
background: linear-gradient(135deg, #0ea5e9, #06b6d4); // Change these
```

**Sidebar Width:**
```scss
// In AdminLayout.module.scss
.mainContent {
  margin-left: 260px; // Change sidebar width
}
```

---

## Adding New Admin Pages

1. **Create page component:**
   ```
   src/pages/Admin/YourPage/YourPage.jsx
   ```

2. **Add to routes.jsx:**
   ```javascript
   const YourPage = lazy(() => import('../pages/Admin/YourPage/YourPage'));

   // Inside /admin route:
   <Route path="yourpage" element={<YourPage />} />
   ```

3. **Add to sidebar:**
   ```javascript
   // In src/components/admin/Sidebar/Sidebar.jsx
   const menuItems = [
     // ... existing items
     {
       path: '/admin/yourpage',
       icon: '🎯',
       label: 'Your Page',
       description: 'Description'
     }
   ];
   ```

---

## 🎨 Component Patterns

### DataTable Usage
```javascript
import DataTable from '../../../components/admin/DataTable/DataTable';

<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
  data={users}
  actions={(user) => (
    <button onClick={() => edit(user)}>Edit</button>
  )}
/>
```

### StatCard Usage
```javascript
import StatCard from '../../../components/admin/StatCard/StatCard';

<StatCard
  title="Total Users"
  value={1234}
  icon="👥"
  color="blue"
  trend="+12%"
/>
```

---

## 🔥 Hot Tips

1. **Mock data is in-memory** - Refreshing page resets changes
2. **All forms have validation** - Check console for errors
3. **Search is case-insensitive** - Works on title and author
4. **Mobile sidebar** - Swipe or click overlay to close
5. **Categories are multi-select** - Click to toggle

---

## 🐛 Common Issues & Fixes

**Issue:** Blank admin pages
- Check browser console for errors
- Verify routes.jsx was saved correctly
- Restart dev server

**Issue:** "User not authorized"
- Check RoleProtectedRoute.jsx line 39
- Verify mock role is set to 'ADMIN'

**Issue:** Changes not saving
- Remember: mock data doesn't persist!
- Connect real API for persistence

**Issue:** Styles not loading
- Verify .module.scss files exist
- Check import paths

---

## 📞 Need Help?

1. Read [ADMIN_DASHBOARD_README.md](./ADMIN_DASHBOARD_README.md) for full documentation
2. Check `// TODO` and `INTEGRATION POINT` comments in code
3. Review mock data in `adminMockService.js` for expected formats

---

**You're all set! Start building! 🚀**
