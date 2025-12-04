import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useTheme } from '@/hooks/useTheme';

export function Register() {
  const { isAuthenticated, isLoading } = useAuthStore();
  useTheme();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
