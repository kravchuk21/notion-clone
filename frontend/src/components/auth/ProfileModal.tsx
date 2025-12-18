import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { User, LogOut, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setErrors({});
    }
  }, [user, isOpen]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    } else if (firstName.trim().length > 50) {
      newErrors.firstName = 'Имя слишком длинное';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    } else if (lastName.trim().length > 50) {
      newErrors.lastName = 'Фамилия слишком длинная';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success('Профиль обновлен');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!user) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Профиль" size="md">
        <div className="space-y-6">
          {/* Avatar and Info */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : 'Пользователь'}
              </h3>
              <p className="text-xs text-text-tertiary mt-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Зарегистрирован {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="bg-bg-secondary cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Имя
                </label>
                <Input
                  type="text"
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Фамилия
                </label>
                <Input
                  type="text"
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full"
              isLoading={isLoading}
            >
              Сохранить изменения
            </Button>
          </div>

          {/* Logout */}
          <div className="border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full text-priority-high hover:bg-priority-high/10 hover:border-priority-high/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Выйти из аккаунта?"
        message="Вы действительно хотите выйти из своего аккаунта?"
        confirmText="Выйти"
        cancelText="Отмена"
        variant="danger"
      />
    </>
  );
}
