import { CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'Kanban-доски для организации задач',
  'Drag & drop интерфейс',
  'Тёмная и светлая тема',
  'Real-time синхронизация',
];

export function AuthHero() {
  return (
    <div className="relative flex flex-col justify-center h-full p-8 lg:p-12 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
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
      <div className="relative z-10">
        {/* Logo & Title */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center">
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
            </div>
            <span className="text-2xl md:text-3xl font-bold text-text-primary">TaskFlow</span>
          </div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
            Организуйте задачи
            <br />
            <span className="text-accent">легко и эффективно</span>
          </h1>
        </div>

        {/* SVG Illustration */}
        <div className="hidden md:block mb-10 lg:mb-12">
          <KanbanIllustration />
        </div>

        {/* Features */}
        <ul className="space-y-3 md:space-y-4">
          {FEATURES.map((feature, index) => (
            <li 
              key={index}
              className="flex items-center gap-3 text-text-secondary"
            >
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm md:text-base">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
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
      <rect
        x="20"
        y="10"
        width="360"
        height="180"
        rx="12"
        className="fill-bg-primary/50 stroke-border"
        strokeWidth="1"
      />

      {/* Column 1 - To Do */}
      <g className="animate-fade-in-up">
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
      </g>

      {/* Column 2 - In Progress */}
      <g className="animate-fade-in-up animation-delay-150">
        <rect x="150" y="25" width="100" height="155" rx="8" className="fill-bg-secondary" />
        <rect x="160" y="35" width="70" height="8" rx="2" className="fill-text-tertiary/50" />
        <rect x="160" y="55" width="80" height="40" rx="4" className="fill-bg-primary stroke-accent" strokeWidth="2" />
        <rect x="167" y="63" width="55" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="167" y="75" width="40" height="4" rx="1" className="fill-text-tertiary/40" />
        <circle cx="230" cy="85" r="4" className="fill-priority-medium" />
        <rect x="160" y="103" width="80" height="35" rx="4" className="fill-bg-primary stroke-border" strokeWidth="1" />
        <rect x="167" y="111" width="60" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="167" y="123" width="45" height="4" rx="1" className="fill-text-tertiary/40" />
      </g>

      {/* Column 3 - Done */}
      <g className="animate-fade-in-up animation-delay-300">
        <rect x="265" y="25" width="100" height="155" rx="8" className="fill-bg-secondary" />
        <rect x="275" y="35" width="50" height="8" rx="2" className="fill-text-tertiary/50" />
        <rect x="275" y="55" width="80" height="35" rx="4" className="fill-bg-primary stroke-priority-low" strokeWidth="1.5" />
        <rect x="282" y="63" width="50" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="282" y="75" width="35" height="4" rx="1" className="fill-text-tertiary/40" />
        <path d="M340 60 L344 64 L352 56" className="stroke-priority-low" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="275" y="98" width="80" height="35" rx="4" className="fill-bg-primary stroke-priority-low" strokeWidth="1.5" />
        <rect x="282" y="106" width="45" height="6" rx="1" className="fill-text-secondary/60" />
        <rect x="282" y="118" width="55" height="4" rx="1" className="fill-text-tertiary/40" />
        <path d="M340 103 L344 107 L352 99" className="stroke-priority-low" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Floating cursor */}
      <g className="animate-float">
        <path d="M200 140 L200 160 L208 155 L212 165 L216 163 L212 153 L220 153 Z" className="fill-accent" />
      </g>
    </svg>
  );
}
