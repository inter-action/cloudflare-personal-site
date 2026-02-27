const skills = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Vue'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Cloudflare Workers', 'PostgreSQL', 'REST APIs'],
  },
  {
    category: 'Tools & DevOps',
    items: ['Git', 'Docker', 'AWS', 'CI/CD'],
  },
];

export function Skills() {
  return (
    <section className='max-w-[1100px] mx-auto px-6 py-20'>
      <div className='flex justify-between items-end mb-12'>
        <div className='space-y-2'>
          <h2 className='text-3xl font-serif italic font-bold'>Technical Skills</h2>
          <p className='text-sm font-display tracking-wide text-muted'>01 — WHAT I WORK WITH</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {skills.map((group) => (
          <div key={group.category} className='p-6 border border-custom rounded-sm'>
            <h3 className='text-lg font-bold text-primary mb-4'>{group.category}</h3>
            <ul className='space-y-2'>
              {group.items.map((skill) => (
                <li key={skill} className='text-sm flex items-center gap-2 text-muted'>
                  <span className='w-1 h-1 bg-primary rounded-full' />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
