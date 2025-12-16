import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children, redirectTo = '/novels' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0B1A2D',
        padding: '20px'
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
