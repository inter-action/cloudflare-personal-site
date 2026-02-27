import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className='px-1.5 py-1 text-[10px] font-bold bg-primary/5 text-primary/60 rounded uppercase tracking-wider'>
      {children}
    </span>
  );
}
