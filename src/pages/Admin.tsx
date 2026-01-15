import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { LoginForm } from '@/components/admin/LoginForm';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

const Admin = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginForm />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default Admin;

