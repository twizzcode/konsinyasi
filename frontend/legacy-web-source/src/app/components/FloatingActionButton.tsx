import { ReactNode } from 'react';

interface FABProps {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ icon, onClick, className = '' }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:shadow-xl transition-all active:scale-95 ${className}`}
    >
      {icon}
    </button>
  );
}
