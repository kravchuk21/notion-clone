import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({
  isOpen,
  onClose,
  triggerRef,
  children,
  align = 'start',
  className,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Calculate position after render using useLayoutEffect
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const padding = 8;

      let top = triggerRect.bottom + padding;
      let left = triggerRect.left;

      if (align === 'center') {
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
      } else if (align === 'end') {
        left = triggerRect.right - popoverRect.width;
      }

      // Adjust if overflowing right
      if (left + popoverRect.width > window.innerWidth - padding) {
        left = window.innerWidth - popoverRect.width - padding;
      }

      // Adjust if overflowing left
      if (left < padding) {
        left = padding;
      }

      // Adjust if overflowing bottom - show above trigger
      if (top + popoverRect.height > window.innerHeight - padding) {
        top = triggerRect.top - popoverRect.height - padding;
      }

      setPosition({ top, left });
    };

    // Initial position
    updatePosition();

    // Update on scroll/resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, triggerRef, align]);

  // Handle click outside and escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={cn(
        'fixed z-50 bg-bg-secondary border border-border rounded-lg shadow-lg',
        className
      )}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    document.body
  );
}
