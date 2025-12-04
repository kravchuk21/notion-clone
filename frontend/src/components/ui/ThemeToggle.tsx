import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Светлая' },
    { value: 'dark' as const, icon: Moon, label: 'Тёмная' },
    { value: 'system' as const, icon: Monitor, label: 'Системная' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-lg">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'p-2 rounded-md transition-colors',
            theme === value
              ? 'bg-bg-primary text-text-primary shadow-notion'
              : 'text-text-secondary hover:text-text-primary'
          )}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

