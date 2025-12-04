import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTheme } from '@/hooks/useTheme';

export function Login() {
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
      <LoginForm />
    </div>
  );
}

