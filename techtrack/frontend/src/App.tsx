import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Tasks from './pages/Tasks';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import Parts from './pages/Parts';
import Reports from './pages/Reports';
import Trips from './pages/Trips';
import Knowledge from './pages/Knowledge';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/layout/Layout';
import { checkAuthState } from './store/slices/authSlice';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <AuthProvider>
      <UIProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="equipment/:id" element={<EquipmentDetail />} />
            <Route path="parts" element={<Parts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="trips" element={<Trips />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;