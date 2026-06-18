import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export function MobileLayout({ children, showNavigation = false }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] bg-background overflow-y-auto relative shadow-2xl">
        {children}
        {showNavigation && <BottomNavigation />}
      </div>
    </div>
  );
}
