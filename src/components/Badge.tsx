import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className='px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-primary-subtle'>
      {children}
    </span>
  );
}
