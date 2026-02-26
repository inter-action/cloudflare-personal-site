import { Github, FileText } from 'lucide-react';

function App() {
  return (
    <div className='min-h-screen'>
      <header className='border-b border-slate-800'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-xl font-bold'>My Portfolio</span>
          </div>
          <nav className='flex items-center gap-4'>
            <a
              href='https://github.com/inter-action/cloudflare-personal-site'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors'
            >
              <Github className='w-5 h-5' />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className='container mx-auto px-4 py-20'>
          <h1 className='text-4xl font-bold mb-6'>Hi, I'm a Frontend Engineer</h1>
          <p className='text-xl text-slate-400 mb-8 max-w-2xl'>
            I'm a passionate frontend engineer with 5+ years of experience building modern web
            applications. I specialize in React, TypeScript, and cloud-native technologies. I love
            creating performant, accessible, and beautiful user interfaces.
          </p>
          <a
            href='https://blog.example.com'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors'
          >
            <FileText className='w-5 h-5 mr-2' />
            Read my blog
          </a>
        </section>

        <section className='container mx-auto px-4 py-16'>
          <h2 className='text-2xl font-bold mb-6'>About Me</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='p-6 rounded-xl bg-slate-900/50 border border-slate-800'>
              <h3 className='text-lg font-semibold mb-2'>What I Do</h3>
              <p className='text-slate-400'>
                I build responsive web applications with modern frameworks, optimize performance,
                and ensure great user experiences. I have experience with React, Vue, TypeScript,
                and various cloud platforms.
              </p>
            </div>
            <div className='p-6 rounded-xl bg-slate-900/50 border border-slate-800'>
              <h3 className='text-lg font-semibold mb-2'>Tech Stack</h3>
              <p className='text-slate-400'>
                React, TypeScript, Tailwind CSS, Node.js, Cloudflare, AWS, Git, and more. Always
                learning and exploring new technologies.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-slate-800 mt-20'>
        <div className='container mx-auto px-4 py-8 text-center text-slate-500'>
          <p>© 2024. Built with React and Cloudflare Pages.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
