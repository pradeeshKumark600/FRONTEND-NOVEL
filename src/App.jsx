import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ReadingProgressProvider } from './context/ReadingProgressContext';
import Footer from './components/layout/Footer/Footer';
import AppRoutes from './routes/routes';
import { consoleHelper } from './utils/consoleHelper';
import './styles/App.scss';

function App() {
  useEffect(() => {
    // Initialize console helper on app load
    consoleHelper.disableDetailed()
  }, [])
  return (
    <AuthProvider>
      <ReadingProgressProvider>
        <div className="app relative min-h-screen overflow-hidden" style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', background: '#0B1A2D' }}>
          <div className="relative z-10" style={{ margin: 0, padding: 0, flex: 1 }}>
            <AppRoutes />
          </div>

          <Footer />
        </div>
      </ReadingProgressProvider>
    </AuthProvider>
  );
}

export default App;
