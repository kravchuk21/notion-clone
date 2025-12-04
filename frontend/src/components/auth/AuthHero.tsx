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
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const featureVariants = {
  initial: { opacity: 0, x: -30 },
  animate: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1] as const,
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
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
  const cycleDuration = 5;
  
  return (
    <svg
      viewBox="0 0 380 200"
      fill="none"
      className="w-full max-w-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
        </filter>
        <filter id="dragShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Board background */}
      <motion.rect
        x="0"
        y="0"
        width="380"
        height="200"
        rx="12"
        className="fill-bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Column 1 - To Do */}
      <motion.g
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <rect x="12" y="12" width="112" height="176" rx="8" className="fill-bg-tertiary/50" />
        
        {/* Header */}
        <g className="transform translate-x-[20px] translate-y-[20px]">
          <circle r="4" cx="4" cy="4" className="fill-priority-high" />
          <rect x="14" y="0" width="45" height="7" rx="2" className="fill-text-primary/60" />
        </g>
        
        {/* Card 1 */}
        <g filter="url(#cardShadow)" className="transform translate-x-[20px] translate-y-[40px]">
          <rect width="96" height="50" rx="6" className="fill-bg-primary" />
          <rect x="8" y="10" width="60" height="6" rx="1.5" className="fill-text-primary/70" />
          <rect x="8" y="22" width="80" height="4" rx="1" className="fill-text-tertiary/40" />
          <rect x="8" y="30" width="50" height="4" rx="1" className="fill-text-tertiary/30" />
          <rect x="8" y="40" width="16" height="5" rx="1.5" className="fill-priority-high/20" />
          <text x="12" y="44" className="fill-priority-high text-[5px] font-medium">HIGH</text>
        </g>
        
        {/* Card 2 */}
        <g filter="url(#cardShadow)" className="transform translate-x-[20px] translate-y-[98px]">
          <rect width="96" height="42" rx="6" className="fill-bg-primary" />
          <rect x="8" y="10" width="55" height="6" rx="1.5" className="fill-text-primary/70" />
          <rect x="8" y="22" width="70" height="4" rx="1" className="fill-text-tertiary/40" />
          <rect x="8" y="32" width="20" height="5" rx="1.5" className="fill-priority-medium/20" />
          <text x="10" y="36" className="fill-priority-medium text-[5px] font-medium">MED</text>
        </g>
      </motion.g>

      {/* Column 2 - In Progress */}
      <motion.g
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <rect x="134" y="12" width="112" height="176" rx="8" className="fill-bg-tertiary/50" />
        
        {/* Header */}
        <g className="transform translate-x-[142px] translate-y-[20px]">
          <circle r="4" cx="4" cy="4" className="fill-accent" />
          <rect x="14" y="0" width="60" height="7" rx="2" className="fill-text-primary/60" />
        </g>
        
        {/* Active Card with glow */}
        <motion.rect
          x="140"
          y="38"
          width="100"
          height="58"
          rx="8"
          className="fill-accent/5"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <g filter="url(#cardShadow)" className="transform translate-x-[142px] translate-y-[40px]">
          <motion.rect 
            width="96" 
            height="54" 
            rx="6" 
            className="fill-bg-primary stroke-accent"
            strokeWidth="1.5"
            animate={{ strokeOpacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="8" y="10" width="65" height="6" rx="1.5" className="fill-text-primary/70" />
          <rect x="8" y="22" width="80" height="4" rx="1" className="fill-text-tertiary/40" />
          {/* Progress indicator */}
          <rect x="8" y="36" width="80" height="3" rx="1.5" className="fill-bg-tertiary" />
          <motion.rect 
            x="8" 
            y="36" 
            height="3" 
            rx="1.5" 
            className="fill-accent"
            animate={{ width: [50, 65, 50] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="8" y="44" width="20" height="5" rx="1.5" className="fill-accent/20" />
          <text x="10" y="48" className="fill-accent text-[5px] font-medium">TASK</text>
        </g>
        
        {/* Drop zone - appears during drag */}
        <motion.rect
          x="142"
          y="102"
          width="96"
          height="44"
          rx="6"
          className="stroke-accent/60 fill-accent/5"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0, 0.8, 0.8, 0],
          }}
          transition={{ 
            duration: cycleDuration, 
            repeat: Infinity, 
            times: [0, 0.2, 0.35, 0.55, 0.65],
          }}
        />
      </motion.g>

      {/* Column 3 - Done */}
      <motion.g
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <rect x="256" y="12" width="112" height="176" rx="8" className="fill-bg-tertiary/50" />
        
        {/* Header */}
        <g className="transform translate-x-[264px] translate-y-[20px]">
          <circle r="4" cx="4" cy="4" className="fill-priority-low" />
          <rect x="14" y="0" width="35" height="7" rx="2" className="fill-text-primary/60" />
        </g>
        
        {/* Completed Card 1 */}
        <g filter="url(#cardShadow)" className="transform translate-x-[264px] translate-y-[40px]">
          <rect width="96" height="44" rx="6" className="fill-bg-primary stroke-priority-low/30" strokeWidth="1" />
          <rect x="8" y="10" width="55" height="6" rx="1.5" className="fill-text-tertiary/50" />
          <rect x="8" y="22" width="70" height="4" rx="1" className="fill-text-tertiary/30" />
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          >
            <circle cx="84" cy="22" r="8" className="fill-priority-low/15" />
            <motion.path
              d="M80 22 L83 25 L89 19"
              className="stroke-priority-low"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </motion.g>
        </g>
        
        {/* Completed Card 2 */}
        <g filter="url(#cardShadow)" className="transform translate-x-[264px] translate-y-[92px]">
          <rect width="96" height="44" rx="6" className="fill-bg-primary stroke-priority-low/30" strokeWidth="1" />
          <rect x="8" y="10" width="48" height="6" rx="1.5" className="fill-text-tertiary/50" />
          <rect x="8" y="22" width="65" height="4" rx="1" className="fill-text-tertiary/30" />
          <circle cx="84" cy="22" r="8" className="fill-priority-low/15" />
          <motion.path
            d="M80 22 L83 25 L89 19"
            className="stroke-priority-low"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          />
        </g>

        {/* Card appearing after drop */}
        <motion.g
          filter="url(#cardShadow)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0, 0, 0, 1, 1],
            y: [152, 152, 152, 152, 144, 144],
          }}
          transition={{ 
            duration: cycleDuration, 
            repeat: Infinity,
            times: [0, 0.5, 0.6, 0.68, 0.75, 1],
            ease: "easeOut",
          }}
        >
          <g className="transform translate-x-[264px]">
            <rect width="96" height="44" rx="6" className="fill-bg-primary stroke-priority-low/30" strokeWidth="1" />
            <rect x="8" y="10" width="60" height="6" rx="1.5" className="fill-text-tertiary/50" />
            <rect x="8" y="22" width="72" height="4" rx="1" className="fill-text-tertiary/30" />
            <circle cx="84" cy="22" r="8" className="fill-priority-low/15" />
            <path
              d="M80 22 L83 25 L89 19"
              className="stroke-priority-low"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </motion.g>
      </motion.g>

      {/* Dragging Card */}
      <motion.g
        filter="url(#dragShadow)"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0, 1, 1, 1, 0, 0],
          x: [20, 20, 20, 90, 200, 264, 264],
          y: [148, 148, 130, 100, 110, 144, 144],
          rotate: [0, 0, -3, 2, -1, 0, 0],
          scale: [1, 1, 1.03, 1.03, 1.03, 1, 1],
        }}
        transition={{ 
          duration: cycleDuration, 
          repeat: Infinity,
          times: [0, 0.15, 0.22, 0.4, 0.55, 0.68, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <rect width="96" height="44" rx="6" className="fill-bg-primary stroke-accent" strokeWidth="2" />
        <rect x="8" y="10" width="60" height="6" rx="1.5" className="fill-text-primary/70" />
        <rect x="8" y="22" width="72" height="4" rx="1" className="fill-text-tertiary/40" />
        <rect x="8" y="32" width="16" height="5" rx="1.5" className="fill-priority-low/20" />
        <text x="11" y="36" className="fill-priority-low text-[5px] font-medium">LOW</text>
      </motion.g>

      {/* Cursor */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0, 1, 1, 1, 0, 0],
          x: [68, 68, 68, 138, 248, 312, 312],
          y: [170, 170, 150, 120, 130, 165, 165],
        }}
        transition={{ 
          duration: cycleDuration, 
          repeat: Infinity,
          times: [0, 0.12, 0.2, 0.4, 0.55, 0.72, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <path
          d="M0 0 L0 18 L4 14.5 L7.5 22 L10.5 20.5 L7 13 L12 13 Z"
          className="fill-text-primary"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* Click effect on pickup */}
      <motion.circle
        cx="68"
        cy="170"
        r="10"
        className="fill-accent"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 1.2, 1.2],
          opacity: [0, 0, 0.3, 0],
        }}
        transition={{
          duration: cycleDuration,
          repeat: Infinity,
          times: [0, 0.18, 0.25, 0.35],
        }}
      />

      {/* Success pulse on drop */}
      <motion.circle
        cx="312"
        cy="165"
        r="15"
        className="fill-priority-low"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 0, 0, 1.5, 1.5],
          opacity: [0, 0, 0, 0, 0.4, 0],
        }}
        transition={{
          duration: cycleDuration,
          repeat: Infinity,
          times: [0, 0.5, 0.55, 0.65, 0.72, 0.85],
        }}
      />
    </svg>
  );
}
