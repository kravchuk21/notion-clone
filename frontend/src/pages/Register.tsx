import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PageTransition } from '@/components/ui/PageTransition';
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
    <PageTransition>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </PageTransition>
  );
}
