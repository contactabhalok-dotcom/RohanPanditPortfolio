export const sampleProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with cart, checkout, and payment integration.',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github_link: 'https://github.com',
    live_link: 'https://demo.com',
    featured: true,
    image_url: null
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Modern portfolio with animations, dark mode, and CMS integration.',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github_link: 'https://github.com',
    live_link: 'https://demo.com',
    featured: true,
    image_url: null
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates and team features.',
    tech_stack: ['React', 'Firebase', 'Redux'],
    github_link: 'https://github.com',
    live_link: 'https://demo.com',
    featured: true,
    image_url: null
  }
]

export const sampleSkills = [
  { id: '1', name: 'React', icon: 'FaReact', category: 'Frontend', proficiency: 90, visible: true },
  { id: '2', name: 'Next.js', icon: 'SiNextdotjs', category: 'Frontend', proficiency: 85, visible: true },
  { id: '3', name: 'TypeScript', icon: 'SiTypescript', category: 'Language', proficiency: 85, visible: true },
  { id: '4', name: 'Node.js', icon: 'FaNodeJs', category: 'Backend', proficiency: 80, visible: true },
  { id: '5', name: 'MongoDB', icon: 'SiMongodb', category: 'Database', proficiency: 75, visible: true },
  { id: '6', name: 'PostgreSQL', icon: 'SiPostgresql', category: 'Database', proficiency: 70, visible: true },
  { id: '7', name: 'Tailwind CSS', icon: 'SiTailwindcss', category: 'Frontend', proficiency: 90, visible: true },
  { id: '8', name: 'Docker', icon: 'SiDocker', category: 'DevOps', proficiency: 65, visible: true },
  { id: '9', name: 'Git', icon: 'SiGit', category: 'Tool', proficiency: 85, visible: true },
  { id: '10', name: 'GraphQL', icon: 'SiGraphql', category: 'API', proficiency: 70, visible: true },
  { id: '11', name: 'Prisma', icon: 'SiPrisma', category: 'ORM', proficiency: 75, visible: true },
  { id: '12', name: 'Figma', icon: 'SiFigma', category: 'Design', proficiency: 65, visible: true }
]

export const sampleBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14',
    slug: 'getting-started-nextjs-14',
    excerpt: 'Learn how to build modern web applications with Next.js 14 and its powerful features.',
    content: 'Full content here...',
    published: true,
    author_name: 'Rohan',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Mastering TypeScript',
    slug: 'mastering-typescript',
    excerpt: 'A comprehensive guide to TypeScript for building type-safe applications.',
    content: 'Full content here...',
    published: true,
    author_name: 'Rohan',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'React Best Practices',
    slug: 'react-best-practices',
    excerpt: 'Essential tips and patterns for writing clean, maintainable React code.',
    content: 'Full content here...',
    published: true,
    author_name: 'Rohan',
    created_at: new Date().toISOString()
  }
]
