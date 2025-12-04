import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'Kanban-доски для организации задач',
  'Drag & drop интерфейс',
  'Тёмная и светлая тема',
  'Real-time синхронизация',
];

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const featureVariants = {
  initial: { opacity: 0, x: -30 },
  animate: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.5 + i * 0.1,
    },
  }),
};

export function AuthHero() {
  return (
    <div className="relative flex flex-col justify-center h-full p-8 lg:p-12 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute -bottom-24 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.25, 1],
            y: [0, -25, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--accent)) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo & Title */}
        <motion.div className="mb-8 md:mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ scale: 1.1 }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-6 h-6 md:w-7 md:h-7 text-white"
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
            <motion.span 
              className="text-2xl md:text-3xl font-bold text-text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              TaskFlow
            </motion.span>
          </div>
          <motion.h1 
            className="text-xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Организуйте задачи
            <br />
            <motion.span 
              className="text-accent inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              легко и эффективно
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* SVG Illustration */}
        <motion.div 
          className="hidden md:block mb-10 lg:mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <KanbanIllustration />
        </motion.div>

        {/* Features */}
        <ul className="space-y-3 md:space-y-4">
          {FEATURES.map((feature, index) => (
            <motion.li 
              key={index}
              className="flex items-center gap-3 text-text-secondary"
              variants={featureVariants}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover={{ x: 8 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              </motion.div>
              <span className="text-sm md:text-base">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function KanbanIllustration() {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      className="w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background card */}
      <motion.rect
        x="20"
        y="10"
        width="360"
        height="180"
        rx="12"
        className="fill-bg-primary/50 stroke-border"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Column 1 - To Do */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <rect x="35" y="25" width="100" height="155" rx="8" className="fill-bg-secondary" />
        <rect x="45" y="35" width="60" height="8" rx="2" className="fill-text-tertiary/50" />
        <rect x="45" y="55" width="80" height="35" rx="4" className="fill-bg-primary stroke-border" strokeWidth="1" />
        <rect x="52" y="63" width="50" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="52" y="75" width="35" height="4" rx="1" className="fill-text-tertiary/40" />
        <rect x="45" y="98" width="80" height="35" rx="4" className="fill-bg-primary stroke-border" strokeWidth="1" />
        <rect x="52" y="106" width="45" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="52" y="118" width="55" height="4" rx="1" className="fill-text-tertiary/40" />
        <rect x="45" y="141" width="80" height="28" rx="4" className="fill-bg-primary stroke-border" strokeWidth="1" />
        <rect x="52" y="149" width="55" height="6" rx="1" className="fill-text-secondary/60" />
      </motion.g>

      {/* Column 2 - In Progress */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <rect x="150" y="25" width="100" height="155" rx="8" className="fill-bg-secondary" />
        <rect x="160" y="35" width="70" height="8" rx="2" className="fill-text-tertiary/50" />
        <motion.rect 
          x="160" y="55" width="80" height="40" rx="4" 
          className="fill-bg-primary stroke-accent" 
          strokeWidth="2"
          animate={{ 
            strokeOpacity: [1, 0.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="167" y="63" width="55" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="167" y="75" width="40" height="4" rx="1" className="fill-text-tertiary/40" />
        <motion.circle 
          cx="230" cy="85" r="4" 
          className="fill-priority-medium"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="160" y="103" width="80" height="35" rx="4" className="fill-bg-primary stroke-border" strokeWidth="1" />
        <rect x="167" y="111" width="60" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="167" y="123" width="45" height="4" rx="1" className="fill-text-tertiary/40" />
      </motion.g>

      {/* Column 3 - Done */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <rect x="265" y="25" width="100" height="155" rx="8" className="fill-bg-secondary" />
        <rect x="275" y="35" width="50" height="8" rx="2" className="fill-text-tertiary/50" />
        <rect x="275" y="55" width="80" height="35" rx="4" className="fill-bg-primary stroke-priority-low" strokeWidth="1.5" />
        <rect x="282" y="63" width="50" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="282" y="75" width="35" height="4" rx="1" className="fill-text-tertiary/40" />
        <motion.path 
          d="M340 60 L344 64 L352 56" 
          className="stroke-priority-low" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <rect x="275" y="98" width="80" height="35" rx="4" className="fill-bg-primary stroke-priority-low" strokeWidth="1.5" />
        <rect x="282" y="106" width="45" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="282" y="118" width="55" height="4" rx="1" className="fill-text-tertiary/40" />
        <motion.path 
          d="M340 103 L344 107 L352 99" 
          className="stroke-priority-low" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      </motion.g>

      {/* Cursor - clean arrow pointer */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, 15, 15, -10, 0],
          y: [0, -5, 10, 5, 0],
        }}
        transition={{ 
          opacity: { duration: 0.3, delay: 0.5 },
          scale: { duration: 0.3, delay: 0.5 },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      >
        {/* Cursor pointer - clean design */}
        <path 
          d="M195 138 L195 162 L201 157 L206 168 L211 166 L206 155 L213 155 Z" 
          className="fill-accent"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Cursor shadow for depth */}
        <path 
          d="M197 140 L197 164 L203 159 L208 170 L213 168 L208 157 L215 157 Z" 
          className="fill-black/10"
          style={{ transform: 'translate(2px, 2px)' }}
        />
      </motion.g>

      {/* Click ripple effect */}
      <motion.circle
        cx="205"
        cy="155"
        r="15"
        className="fill-accent/20"
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{
          scale: [0, 1.5, 1.5],
          opacity: [0.6, 0.2, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 1.5,
          delay: 2.5,
          ease: "easeOut",
        }}
        style={{ transformOrigin: '205px 155px' }}
      />
    </svg>
  );
}
