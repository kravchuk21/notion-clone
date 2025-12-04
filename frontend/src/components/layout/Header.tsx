import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-14 border-b border-border bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors">
          <LayoutDashboard size={24} />
          <span className="font-semibold text-lg hidden sm:inline">TaskFlow</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user && (
            <>
              <span className="text-sm text-text-secondary hidden sm:inline">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={18} />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

