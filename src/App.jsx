import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Layout from './components/Layout';
import GuestLanding from './components/GuestLanding';
import Login from './pages/Login';
import { isGuestMode, clearGuest } from './lib/guestProgress';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Lab from './pages/Lab';
import MascotStudio from './pages/MascotStudio';
import KnowledgeBase from './pages/KnowledgeBase';
import BattleLogs from './pages/BattleLogs';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  const [guestActive, setGuestActive] = useState(() => {
  const val = isGuestMode();
  console.log("guestActive init:", val);
  return val;
});
  const [showLogin, setShowLogin] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return params.get('showLogin') === 'true';
});

  // When user logs in, clear guest mode
  useEffect(() => {
  if (isAuthenticated && guestActive) {
    clearGuest();
    setGuestActive(false);
  }
  if (isAuthenticated) {
    setShowLogin(false);
  }
  // If showLogin param is in URL, force show login even in guest mode
  const params = new URLSearchParams(window.location.search);
  if (params.get('showLogin') === 'true' && !isAuthenticated) {
    setShowLogin(true);
    setGuestActive(false);
  }
}, [isAuthenticated]);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && !guestActive) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return (
      <GuestLanding
        onGuestStart={() => setGuestActive(true)}
        onLogin={() => setShowLogin(true)}
      />
    );
  }

  return (
    <Routes>
      <Route element={<Layout isGuest={false} />}>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/mascot" element={<MascotStudio />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/battle-logs" element={<BattleLogs />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App