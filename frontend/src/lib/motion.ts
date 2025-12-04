import type { Variants, Transition } from 'framer-motion';

// ============================================
// Transitions - более плавные, без дёрганья
// ============================================

export const transitions = {
  // Мягкий spring без излишнего отскока
  spring: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  // Быстрый tween для micro-interactions
  quick: { duration: 0.15, ease: 'easeOut' },
  // Плавный для fade эффектов
  smooth: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  // Для page transitions
  page: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  // Для auth форм - плавный переход без резких движений
  auth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
} satisfies Record<string, Transition>;

// ============================================
// Page Transitions
// ============================================

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.page,
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15 },
  },
};

// ============================================
// Stagger Animations
// ============================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
};

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.smooth,
  },
};

// ============================================
// Fade Animations
// ============================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.smooth },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1 } },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: 4, transition: { duration: 0.1 } },
};

// ============================================
// Scale Animations
// ============================================

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: transitions.smooth },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.1 } },
};

export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.1 } },
};

// ============================================
// Slide Animations
// ============================================

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: transitions.smooth },
  exit: { opacity: 0, x: -8, transition: { duration: 0.1 } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: transitions.smooth },
  exit: { opacity: 0, x: 8, transition: { duration: 0.1 } },
};

// ============================================
// Interactive Animations (micro-interactions)
// ============================================

export const tapScale = {
  whileTap: { scale: 0.98 },
  transition: transitions.quick,
};

export const hoverLift = {
  whileHover: { y: -2 },
  transition: transitions.quick,
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  transition: transitions.quick,
};

// ============================================
// Dropdown/Modal Animations
// ============================================

export const dropdownVariants: Variants = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: transitions.quick,
  },
  exit: { 
    opacity: 0, 
    y: -4, 
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.smooth,
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 8,
    transition: { duration: 0.1 },
  },
};

// ============================================
// Card Animations
// ============================================

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

// ============================================
// List Item Animations (for add/remove)
// ============================================

export const listItemVariants: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.15 },
  },
};

// ============================================
// Auth Page Animations
// ============================================

export const authFormVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: transitions.auth,
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 },
  },
};

export const authStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const authStaggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const authIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.5, rotate: -180 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.34, 1.56, 0.64, 1], // spring-like easing
    },
  },
};

export const authCardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 },
  },
};

export const authFeatureVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================
// Side Panel Animations
// ============================================

export const sidePanelVariants: Variants = {
  initial: { x: '100%' },
  animate: { 
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { 
    x: '100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const sidePanelBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
