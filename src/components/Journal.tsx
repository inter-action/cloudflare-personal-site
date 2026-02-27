interface JournalEntry {
  id: string;
  date: string;
  title: string;
  excerpt: string;
}

const journalEntries: JournalEntry[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    title: 'The Ethics of Minimalist Interface Design',
    excerpt:
      'Exploring how white space influences cognitive load and user trust in modern web applications.',
  },
  {
    id: '2',
    date: 'Sep 12, 2023',
    title: 'React and the Renaissance of Web Craft',
    excerpt:
      'How functional programming patterns reflect the modular philosophy of early typography.',
  },
];

export function Journal() {
  return (
    <section className='bg-stone-100 dark:bg-slate-900/50 py-24'>
      <div className='max-w-[1100px] mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
          <div>
            <h2 className='text-3xl font-serif italic font-bold mb-8'>Latest Journal Entries</h2>
            <div className='space-y-12'>
              {journalEntries.map((entry) => (
                <article key={entry.id} className='group'>
                  <time className='text-[10px] font-bold tracking-widest text-primary uppercase'>
                    {entry.date}
                  </time>
                  <h4 className='text-xl font-serif font-bold mt-2 group-hover:underline cursor-pointer'>
                    {entry.title}
                  </h4>
                  <p className='text-ink/60 dark:text-slate-400 mt-2 text-sm line-clamp-2'>
                    {entry.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className='flex flex-col justify-center items-center text-center p-12 border border-ink/5 dark:border-white/5 bg-background-light dark:bg-background-dark rounded-sm'>
            <span className='material-symbols-outlined text-4xl text-primary mb-6'>mail</span>
            <h3 className='text-2xl font-serif italic font-bold mb-4'>Subscribe to the Archive</h3>
            <p className='text-ink/60 dark:text-slate-400 text-sm mb-8 max-w-xs'>
              Monthly insights on frontend craft, design systems, and scholarly web development.
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
