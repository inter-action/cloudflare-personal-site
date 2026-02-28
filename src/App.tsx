import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';

function App() {
  const [activePath, setActivePath] = useState('/');

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <div className='relative flex min-h-screen w-full flex-col'>
      <div className='layout-container flex h-full grow flex-col'>
        <Navbar activePath={activePath}/>
        <main className='flex-1'>
          <Hero />
          <div className='max-w-[1100px] mx-auto px-6'>
            <div className='h-px w-full bg-border-subtle' />
          </div>
          <Skills />
          {/* hide it for now, need to get data somewhere */}
          {/* <BlogSection /> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;