import { Github, Terminal } from 'lucide-react';
import { Button } from './Button';

export function Hero() {
  return (
    <div className='max-w-[1100px] mx-auto px-6 py-16 md:py-28'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <div className='flex flex-col gap-8'>
          <div className='space-y-4'>
            <span className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>
              Full-Stack Developer
            </span>
            <h1 className='text-ink dark:text-slate-100 text-5xl md:text-7xl font-serif font-bold leading-[1.1]'>
              Hi, I'm <span className='text-primary'>Miao</span>
            </h1>
            <p className='text-ink/80 dark:text-slate-300 text-lg md:text-xl font-display leading-relaxed max-w-md'>
              I build fast, accessible, and beautiful web applications. Currently focused on
              TypeScript, React, and Cloudflare infrastructure.
            </p>
          </div>
        </div>
        <div className='relative flex justify-center items-center'>
          <div className='w-full aspect-square max-w-[400px] bg-stone-100 dark:bg-slate-800 rounded-sm overflow-hidden border border-stone-200 dark:border-slate-700 p-8 flex items-center justify-center'>
            <div className='w-full h-full border border-stone-300 dark:border-slate-600 flex items-center justify-center relative bg-stone-50 dark:bg-slate-900'>
              <div className='absolute inset-0 opacity-5 flex items-center justify-center'>
                <Terminal className='w-32 h-32' />
              </div>
              <div className='z-10 font-mono text-sm text-left space-y-2 p-6'>
                <div className='text-green-600 dark:text-green-400'>$ whoami</div>
                <div className='text-ink/80 dark:text-slate-300'>miao</div>
                <div className='text-green-600 dark:text-green-400 mt-4'>$ cat skills.json</div>
                <div className='text-ink/80 dark:text-slate-300'>{'{'}</div>
                <div className='text-ink/80 dark:text-slate-300 pl-4'>
                  "frontend": ["React", "TypeScript", "Tailwind"],
                </div>
                <div className='text-ink/80 dark:text-slate-300 pl-4'>
                  "backend": ["Node.js", "Cloudflare"],
                </div>
                <div className='text-ink/80 dark:text-slate-300 pl-4'>
                  "tools": ["Git", "Docker"]
                </div>
                <div className='text-ink/80 dark:text-slate-300'>{'}'}</div>
                <div className='text-green-600 dark:text-green-400 mt-4 animate-pulse'>_</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
