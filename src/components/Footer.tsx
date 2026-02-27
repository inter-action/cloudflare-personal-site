import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-custom py-12 px-6 md:px-20'>
      <div className='max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
        <div className='flex items-center gap-3'>
          <p className='text-xs font-bold tracking-widest uppercase text-muted opacity-60'>
            © 2026 Miao
          </p>
        </div>
        <div className='flex gap-8'>
          <a className='text-muted opacity-60 hover:text-primary transition-colors' href='#'>
            <Github className='w-4 h-4' />
          </a>
        </div>
      </div>
    </footer>
  );
}
