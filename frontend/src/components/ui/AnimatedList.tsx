import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainer, staggerContainerFast, staggerItem, staggerItemScale } from '@/lib/motion';

export interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  /** Use faster stagger timing */
  fast?: boolean;
}

export function AnimatedList({ children, className, fast = false }: AnimatedListProps) {
  return (
    <motion.div
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  /** Use scale animation instead of slide */
  scale?: boolean;
}

export function AnimatedListItem({ children, className, scale = false }: AnimatedListItemProps) {
  return (
    <motion.div
      variants={scale ? staggerItemScale : staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
}

