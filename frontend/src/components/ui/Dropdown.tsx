import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { dropdownVariants } from '@/lib/motion';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'absolute z-50 mt-1 min-w-[160px] rounded-md border border-border bg-bg-primary py-1 shadow-notion-lg overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  className?: string;
}

export function DropdownItem({ children, onClick, variant = 'default', className }: DropdownItemProps) {
  const variants = {
    default: 'text-text-primary hover:bg-bg-hover',
    danger: 'text-priority-high hover:bg-priority-high/10',
  };

  return (
    <motion.button
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        'w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
