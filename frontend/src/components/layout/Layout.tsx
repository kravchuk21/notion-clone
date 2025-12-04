import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

