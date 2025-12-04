import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Zap, Lock } from 'lucide-react';
import { 
  authStaggerContainer, 
  authStaggerItem, 
  authIconVariants, 
  authCardVariants,
  authFeatureVariants 
} from '@/lib/motion';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@/constants';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success(SUCCESS_MESSAGES.AUTH.WELCOME);
      navigate('/');
    } catch {
      // Error handled by API client
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full"
      variants={authStaggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header with logo for right panel */}
      <motion.div className="text-center mb-8" variants={authStaggerItem}>
        <motion.div 
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/25 mb-4"
          variants={authIconVariants}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-7 h-7 text-white"
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold text-text-primary"
          variants={authStaggerItem}
        >
          С возвращением!
        </motion.h1>
        <motion.p 
          className="text-text-secondary mt-2"
          variants={authStaggerItem}
        >
          Войдите, чтобы продолжить работу
        </motion.p>
      </motion.div>

      {/* Form card */}
      <motion.div 
        className="bg-bg-primary rounded-2xl border border-border p-6 shadow-lg shadow-black/5"
        variants={authCardVariants}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={authStaggerItem}>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </motion.div>

          <motion.div variants={authStaggerItem}>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Пароль
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </motion.div>

          <motion.div variants={authStaggerItem}>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Войти
            </Button>
          </motion.div>
        </form>

        <motion.p 
          className="text-center text-sm text-text-secondary mt-5"
          variants={authStaggerItem}
        >
          Нет аккаунта?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </motion.p>
      </motion.div>

      {/* Trust indicators */}
      <motion.div 
        className="mt-8 grid grid-cols-3 gap-3"
        variants={authStaggerItem}
      >
        {[
          { icon: Shield, label: 'Безопасно' },
          { icon: Zap, label: 'Быстро' },
          { icon: Lock, label: 'Приватно' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="flex flex-col items-center text-center p-3 rounded-xl bg-bg-primary/50 border border-border/50 hover:bg-bg-primary/80 transition-colors"
            variants={authFeatureVariants}
            custom={index}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-2"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <item.icon className="w-4 h-4 text-accent" />
            </motion.div>
            <span className="text-xs text-text-secondary">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom decoration */}
      <motion.div 
        className="mt-8 text-center"
        variants={authStaggerItem}
      >
        <p className="text-xs text-text-tertiary">
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </motion.div>
    </motion.div>
  );
}

