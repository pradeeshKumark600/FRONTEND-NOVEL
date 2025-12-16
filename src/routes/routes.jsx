import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load page components
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const NovelsPage = lazy(() => import('../pages/NovelsPage/NovelsPage'));
const NovelDetailPage = lazy(() => import('../pages/NovelDetailPage/NovelDetailPage'));
const ThenmozhiNovelPage = lazy(() => import('../pages/ThenmozhiNovelPage/ThenmozhiNovelPage'));
const SwethaNovelPage = lazy(() => import('../pages/SwethaNovelPage/SwethaNovelPage'));
const MohanaNovelPage = lazy(() => import('../pages/MohanaNovelPage/MohanaNovelPage'));
const ChapterPage = lazy(() => import('../pages/ChapterPage/ChapterPage'));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import('../components/admin/AdminLayout/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard/AdminDashboard'));
const NovelList = lazy(() => import('../pages/Admin/NovelManagement/NovelList'));
const NovelCreate = lazy(() => import('../pages/Admin/NovelManagement/NovelCreate'));
const NovelEdit = lazy(() => import('../pages/Admin/NovelManagement/NovelEdit'));
const ChapterList = lazy(() => import('../pages/Admin/ChapterManagement/ChapterList'));
const ChapterCreate = lazy(() => import('../pages/Admin/ChapterManagement/ChapterCreate'));
const ChapterEdit = lazy(() => import('../pages/Admin/ChapterManagement/ChapterEdit'));
const NotificationCenter = lazy(() => import('../pages/Admin/NotificationCenter/NotificationCenter'));
const ForbiddenPage = lazy(() => import('../pages/Admin/ForbiddenPage/ForbiddenPage'));

// Import route guard
import RoleProtectedRoute from '../components/common/RoleProtectedRoute/RoleProtectedRoute';

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0B1A2D',
    color: '#fff'
  }}>
    <div>Loading...</div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/novels" element={<NovelsPage />} />
        {/* Specific routes first (for hardcoded novel pages) */}
        <Route path="/novel/1" element={<ThenmozhiNovelPage />} />
        <Route path="/novel/2" element={<SwethaNovelPage />} />
        <Route path="/novel/3" element={<MohanaNovelPage />} />
        {/* Generic routes after specific ones */}
        <Route path="/novel/:id" element={<NovelDetailPage />} />
        <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />

        {/* 403 Forbidden Page (no protection needed) */}
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Admin Routes - Protected by RoleProtectedRoute */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Novel Management */}
          <Route path="novels" element={<NovelList />} />
          <Route path="novels/create" element={<NovelCreate />} />
          <Route path="novels/edit/:id" element={<NovelEdit />} />

          {/* Chapter Management */}
          <Route path="chapters" element={<ChapterList />} />
          <Route path="chapters/create" element={<ChapterCreate />} />
          <Route path="chapters/edit/:id" element={<ChapterEdit />} />

          {/* Notifications */}
          <Route path="notifications" element={<NotificationCenter />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
