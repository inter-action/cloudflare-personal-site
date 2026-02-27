interface NavbarProps {
  activePath?: string;
}

export function Navbar({ activePath = '/' }: NavbarProps) {
  const isActive = (path: string) => activePath === path;

  return (
    <header className='sticky top-0 z-50 flex items-center justify-between border-b border-ink/5 bg-background-light/80 backdrop-blur-md px-6 md:px-20 py-4 dark:bg-background-dark/80 dark:border-slate-800'>
      <div className='flex items-center gap-12'>
        <div className='flex items-center gap-3'>
          <div className='size-6 text-primary'>
            <svg fill='none' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
              <path
                clipRule='evenodd'
                d='M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z'
                fill='currentColor'
                fillRule='evenodd'
              />
            </svg>
          </div>
          <h2 className='text-lg font-bold tracking-tight'>Dev</h2>
        </div>
        <nav className='hidden md:flex items-center gap-8'>
          <a
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-primary underline underline-offset-4'
                : 'text-ink/70 dark:text-slate-400 hover:text-primary'
            }`}
            href='/'
          >
            Home
          </a>
          <a
            className={`text-sm font-medium transition-colors ${
              isActive('/blog')
                ? 'text-primary underline underline-offset-4'
                : 'text-ink/70 dark:text-slate-400 hover:text-primary'
            }`}
            href='/blog'
          >
            Blog
          </a>
        </nav>
      </div>
      <div className='flex items-center gap-6'>
        <a
          href='https://github.com/inter-action/cloudflare-personal-site'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-bold text-primary hover:opacity-80'
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
