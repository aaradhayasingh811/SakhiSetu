import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TrackerForm from './pages/TrackerForm';
import InsightsPage from './pages/InsightsPage';
import GPTCompanion from './pages/GPTCompanion';
import PartnerSync from './pages/PartnerSync';
import EmergencySetting from './pages/EmergencySetting';
import Layout from './components/Layout';
import PeriodTracker from './pages/PeriodTracker';
import PcosRiskChecker from './pages/PcosRiskChecker';
import NextPeriodPredictor from './pages/NextPeriodPredictor';
import { CommunityProvider } from './contexts/CommunityContext.jsx';
import CommunityHome from './pages/community/CommunityHome';
import UserProfile from './pages/community/UserProfile';
import PostDetail from './pages/community/PostDetail';
import UserProfiles from './pages/UserProfile.jsx';
import Education from './pages/Education';
import './App.css'; 
import UserSelfPosts from './pages/UserSelfPosts.jsx';
import CreatePostModal from './components/community/CreatePostModal.jsx';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setIsAuthenticated(false);
    setLoading(false);
    return;
  }

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(response.data.success);
    } catch (error) {
      console.error('Token verification failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  verifyToken();
}, []);


  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="text-center p-4 text-lg font-semibold">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
    <CommunityProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All authenticated routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<TrackerForm />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/gpt" element={<GPTCompanion />} />
          <Route path="/partner" element={<PartnerSync />} />
          <Route path="/emergency" element={<EmergencySetting />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          <Route path='/pcos' element={<PcosRiskChecker/>} />
          <Route path='/next-period' element={<NextPeriodPredictor/>} />
          <Route path="/community" element={<CommunityHome />} />
          <Route path="/community/posts/:postId" element={<PostDetail />} />
          {/* <Route path="/community/categories/:categoryId" element={<CategoryView />} /> */}
          <Route path="/community/profile/:userId" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/education" element={<Education />} />
          <Route path="/my-post" element={<UserSelfPosts />} />
          {/* <Route path="/community/create-post" element={<CreatePostModal />} /> */}

        </Route>
      </Routes>
      </CommunityProvider>
    </BrowserRouter>
  );
}

export default App;
