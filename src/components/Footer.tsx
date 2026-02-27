import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-stone-200 dark:border-slate-800 py-12 px-6 md:px-20'>
      <div className='max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
        <div className='flex items-center gap-3'>
          <p className='text-xs font-bold tracking-widest uppercase text-ink/50 dark:text-slate-500'>
            © 2024 Miao
          </p>
        </div>
        <div className='flex gap-8'>
          <a
            className='text-ink/40 dark:text-slate-500 hover:text-primary transition-colors text-xs font-bold tracking-widest uppercase'
            href='#'
          >
            <Github className='w-4 h-4' />
          </a>
        </div>
      </div>
    </footer>
  );
}
