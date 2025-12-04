import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PageTransition } from '@/components/ui/PageTransition';
import { useTheme } from '@/hooks/useTheme';

export function Login() {
  const { isAuthenticated, isLoading } = useAuthStore();
  useTheme();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageTransition>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </PageTransition>
  );
}
