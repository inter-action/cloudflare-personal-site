import { Mail } from 'lucide-react';

interface BlogPost {
  id: string;
  date: string;
  title: string;
  excerpt: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    date: 'Feb 20, 2026',
    title: 'Building a Static Blog with Cloudflare Pages',
    excerpt: 'How I built this site using Cloudflare Pages, React, and TypeScript.',
  },
  {
    id: '2',
    date: 'Jan 15, 2026',
    title: 'TypeScript Best Practices in 2026',
    excerpt: 'Lessons learned from migrating a large codebase to strict TypeScript.',
  },
];

export function BlogSection() {
  return (
    <section className='bg-stone-100 dark:bg-slate-900/50 py-24'>
      <div className='max-w-[1100px] mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
          <div>
            <h2 className='text-3xl font-serif italic font-bold mb-8'>Latest Posts</h2>
            <div className='space-y-12'>
              {blogPosts.map((post) => (
                <article key={post.id} className='group cursor-pointer'>
                  <time className='text-[10px] font-bold tracking-widest text-primary uppercase'>
                    {post.date}
                  </time>
                  <h4 className='text-xl font-serif font-bold mt-2 group-hover:text-primary transition-colors'>
                    {post.title}
                  </h4>
                  <p className='text-ink/60 dark:text-slate-400 mt-2 text-sm line-clamp-2'>
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className='flex flex-col justify-center items-center text-center p-12 border border-stone-200 dark:border-slate-700 bg-background-light dark:bg-background-dark rounded-sm'>
            <Mail className='w-10 h-10 text-primary mb-6' />
            <h3 className='text-2xl font-serif italic font-bold mb-4'>Stay Updated</h3>
            <p className='text-ink/60 dark:text-slate-400 text-sm mb-8 max-w-xs'>
              Get notified when I publish new articles about web development.
            </p>
            <div className='w-full flex gap-2'>
              <input
                className='flex-1 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-sm p-3 focus:ring-primary focus:border-primary outline-none'
                placeholder='Your email address'
                type='email'
              />
              <button className='bg-primary text-white px-6 font-bold text-xs uppercase tracking-widest hover:opacity-90'>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
