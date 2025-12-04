import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, Sparkles, Users } from 'lucide-react';
import { 
  authStaggerContainer, 
  authStaggerItem, 
  authIconVariants, 
  authCardVariants,
  authFeatureVariants 
} from '@/lib/motion';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ email, password });
      toast.success('Аккаунт создан!');
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
      {/* Header */}
      <motion.div className="text-center mb-8" variants={authStaggerItem}>
        <motion.div 
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/25 mb-4"
          variants={authIconVariants}
        >
          <Sparkles className="w-7 h-7 text-white" />
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold text-text-primary"
          variants={authStaggerItem}
        >
          Создайте аккаунт
        </motion.h1>
        <motion.p 
          className="text-text-secondary mt-2"
          variants={authStaggerItem}
        >
          Начните организовывать задачи уже сегодня
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
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Подтвердите пароль
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
          </motion.div>

          <motion.div variants={authStaggerItem}>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Создать аккаунт
            </Button>
          </motion.div>
        </form>

        <motion.p 
          className="text-center text-sm text-text-secondary mt-5"
          variants={authStaggerItem}
        >
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Войти
          </Link>
        </motion.p>
      </motion.div>

      {/* Benefits */}
      <motion.div 
        className="mt-8 space-y-3"
        variants={authStaggerItem}
      >
        {[
          { 
            icon: CheckCircle2, 
            color: 'bg-priority-low/10', 
            iconColor: 'text-priority-low',
            title: 'Бесплатный план', 
            desc: 'Без ограничений по времени' 
          },
          { 
            icon: Users, 
            color: 'bg-accent/10', 
            iconColor: 'text-accent',
            title: 'Командная работа', 
            desc: 'Real-time синхронизация' 
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary/50 border border-border/50 hover:bg-bg-primary/80 transition-colors"
            variants={authFeatureVariants}
            custom={index}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <item.icon className={`w-4 h-4 ${item.iconColor}`} />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom */}
      <motion.div 
        className="mt-6 text-center"
        variants={authStaggerItem}
      >
        <p className="text-xs text-text-tertiary">
          Регистрируясь, вы соглашаетесь с условиями использования
        </p>
      </motion.div>
    </motion.div>
  );
}

