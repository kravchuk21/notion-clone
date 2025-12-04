import { AuthHero } from './AuthHero';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Hero */}
      <aside className="md:w-1/2 lg:w-[55%] bg-bg-tertiary">
        {/* Mobile: compact version */}
        <div className="md:hidden px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 text-white"
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
            <span className="text-xl font-semibold text-text-primary">TaskFlow</span>
          </div>
        </div>
        
        {/* Desktop: full hero */}
        <div className="hidden md:block h-full">
          <AuthHero />
        </div>
      </aside>

      {/* Right Panel - Form */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-8 bg-bg-secondary">
        {children}
      </main>
    </div>
  );
}
