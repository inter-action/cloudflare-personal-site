interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
}

const projects: Project[] = [
  {
    id: '1',
    category: 'Editorial Design',
    title: 'The Scholarly Archive',
    description: 'A digital preservation project for historical documents.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2kQ6xPA3saMgBVDa1nmAc77DhKw58KMG28rfj3gY4IK8pDEFcFhPm3B4MLk97_dbEirYmvTewhVbPB9oeP0bcfcPqRE561OS_w75kPQ4EMGJzgvc127aGs7SzbSW9xxkMviQWkNARCk9D9ErPuYXMIujVOJU2qkBsd031KhGl9gZkTTVPgpRRhztAxzBfmA-aRsHmMe3nvlwXo7ewDD6n3apGm3RM2Q_8f8cZRywLNQlIbiGeqSnTMxUcZq8trDs8u7sc_ESAUs-',
  },
  {
    id: '2',
    category: 'React Architecture',
    title: 'Minimalist Blog Kit',
    description: 'An open-source boilerplate for focused writers.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy3OO9Mh_Q3MflYGGyGW3FpBCFcPik3mxwPoWql83GIgLiLVuNez0kLLYf2fmdWd7lJblasCAiTtMBSBMOJhHMLa8J0uea5HTwIBK9X1HEEGYIvbTIZ5TEf3LpwuDfG4mB5Gfbh3jSZteVOASYBqLi0lDdJT2LCfkDJG2lqUDAf2Pc9GgQ-wbhkCRrzYEbqar2NIllQ6DXFbKpuCP_qfhGXPlnoVm5EA15KTJ7G_BTSC4yDFaMrjT7mpGjrVByjIuJNGDU7z5fk1C_',
  },
  {
    id: '3',
    category: 'Typography / UI',
    title: 'Curated Portfolio v2',
    description: 'High-end showcase for creative professionals.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjV05vhLrKAhmp_K47OojDwqZyGR83Rm5_WYHTAc69_XXc8w2smgqj9uPyyU-U4xi5MNUvkyeURbZPGoZoP_Bh7_d9M66zBPzK4ghZpVpYfZ2-eG2SQGU1HQ9can1xRpqMmIN_ZT7qYX-vUG2yycVssX9iYZJCZ4i7B_NBwVD2kaFU-XNmuZq6rZavreJZ3eyVs6VMpy7Njy7vOsuQk457T1dbutImkLpgRj8Q6IG4Z2W6K0XjBGnPmw_ZwOCGIHndD_5CWW2lqDJz',
  },
];

export function FeaturedWorks() {
  return (
    <section className='max-w-[1100px] mx-auto px-6 py-20'>
      <div className='flex justify-between items-end mb-12'>
        <div className='space-y-2'>
          <h2 className='text-ink dark:text-slate-100 text-3xl font-serif italic font-bold'>
            Selected Collections
          </h2>
          <p className='text-ink/60 dark:text-slate-400 text-sm font-display tracking-wide'>
            01 — DIGITAL MANUSCRIPTS
          </p>
        </div>
        <a
          className='text-primary font-bold text-sm tracking-widest uppercase border-b-2 border-primary/20 pb-1 hover:border-primary transition-all'
          href='#'
        >
          View All Cases
        </a>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {projects.map((project) => (
          <div key={project.id} className='group cursor-pointer'>
            <div className='aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-slate-800 mb-6 border border-stone-200 dark:border-slate-700 transition-transform duration-500 group-hover:-translate-y-2'>
              <div
                className='w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105'
                style={{ backgroundImage: `url("${project.image}")` }}
              />
            </div>
            <div className='space-y-2'>
              <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-ink/40 dark:text-slate-500'>
                {project.category}
              </p>
              <h3 className='text-xl font-serif font-bold group-hover:text-primary transition-colors'>
                {project.title}
              </h3>
              <p className='text-ink/60 dark:text-slate-400 text-sm leading-relaxed'>
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
