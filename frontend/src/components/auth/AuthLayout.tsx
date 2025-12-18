import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthHero } from './AuthHero';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

const formContainerVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Hero */}
      <aside className="md:w-1/2 lg:w-[55%] bg-bg-tertiary">
        {/* Mobile: compact version */}
        <div className="md:hidden px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <img
                src="/notion-icon.svg"
                alt="Notion Clone"
                className="w-6 h-6 text-accent"
              />
            </motion.div>
            <motion.span 
              className="text-xl font-semibold text-text-primary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              TaskFlow
            </motion.span>
          </div>
        </div>
        
        {/* Desktop: full hero */}
        <div className="hidden md:block h-full">
          <AuthHero />
        </div>
      </aside>

      {/* Right Panel - Form */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-8 bg-bg-secondary relative overflow-hidden min-h-[600px]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <motion.div 
            className="absolute top-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 left-10 w-48 h-48 bg-accent/8 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, -15, 0],
              y: [0, 15, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgb(var(--text-primary)) 1px, transparent 1px),
                linear-gradient(90deg, rgb(var(--text-primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Floating shapes */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-3 h-3 bg-accent/20 rounded-full"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-accent/30 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute top-2/3 left-1/4 w-4 h-4 bg-accent/15 rounded-full"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Corner decorations */}
          <motion.svg 
            className="absolute top-0 right-0 w-32 h-32 text-accent/5" 
            viewBox="0 0 100 100"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <circle cx="100" cy="0" r="60" fill="currentColor" />
          </motion.svg>
          <motion.svg 
            className="absolute bottom-0 left-0 w-24 h-24 text-accent/5" 
            viewBox="0 0 100 100"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <circle cx="0" cy="100" r="50" fill="currentColor" />
          </motion.svg>
          
          {/* Extra animated particles */}
          <motion.div 
            className="absolute top-1/2 right-1/5 w-1.5 h-1.5 bg-accent/40 rounded-full"
            animate={{ 
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-accent/25 rounded-full"
            animate={{ 
              y: [0, -25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>

        {/* Content with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isLogin ? 'login' : 'register'}
            className="relative z-10 w-full max-w-md"
            variants={formContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
