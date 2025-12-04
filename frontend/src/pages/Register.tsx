import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useTheme } from '@/hooks/useTheme';

export function Register() {
  const { isAuthenticated, isLoading } = useAuthStore();
  useTheme(); // Apply theme

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
      <RegisterForm />
    </div>
  );
}

