import { Terminal } from 'lucide-react';
import { Button } from './Button';

export function Hero() {
  return (
    <div className='max-w-[1100px] mx-auto px-6 py-16 md:py-28'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
        <div className='flex flex-col gap-8'>
          <div className='space-y-4'>
            <span className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>
              Kinda Full-Stack Developer
            </span>
            <h1 className='text-5xl md:text-7xl font-serif font-bold leading-[1.1]'>
              Hi, I'm <span className='text-primary'>Miao</span>
            </h1>
            <p className='text-lg md:text-xl font-display leading-relaxed max-w-md text-muted'>
              I build fast, accessible, and beautiful web applications. Primarily using reactjs tech stack on my professional job.
              Currently focus on vibe coding related techniques.
            </p>
          </div>
          <div>
            <a href='/blog' className='inline-block'>
              <Button variant='primary'>Read My Blog</Button>
            </a>
          </div>
        </div>
        <div className='relative flex justify-center items-center'>
          <div className='w-full rounded-sm overflow-hidden border border-custom p-2 flex items-center justify-center bg-surface'>
            <div className='w-full h-full border border-custom flex items-center justify-center relative bg-background-light dark:bg-background-dark'>
              <div className='absolute inset-0 opacity-5 flex items-center justify-center'>
                <Terminal className='w-32 h-32' />
              </div>
              <div className='z-10 font-mono text-sm text-left space-y-2 p-6'>
                <div className='text-green-500'>$ whoami</div>
                <div className='text-muted'>miao</div>
                <div className='text-green-500 mt-4'>$ cat skills.json</div>
                <div className='text-muted'>{'{'}</div>
                <div className='pl-4 text-muted'>
                  "frontend": ["React", "TypeScript", "Tailwind"],
                </div>
                <div className='pl-4 text-muted'>"backend": ["Node.js", "Python", "Cloudflare"],</div>
                <div className='pl-4 text-muted'>"DevOps": ["Docker", "K8s"]</div>
                <div className='text-muted'>{'}'}</div>
                <div className='text-green-500 mt-4 animate-pulse'>_</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}