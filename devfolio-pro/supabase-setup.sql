-- ============================================================================
-- SUPABASE DATABASE SETUP FOR DEVFOLIO
-- ============================================================================
-- Go to: https://supabase.com/dashboard/project/znmzksgligtgokpsrhmw
-- Click "SQL Editor" in the left sidebar
-- Copy and paste this entire script
-- Click "Run" button
-- ============================================================================

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  image_url TEXT,
  github_link TEXT,
  live_link TEXT,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  proficiency INTEGER DEFAULT 50,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  author_name TEXT DEFAULT 'Rohan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES FOR PUBLIC READ ACCESS
-- ============================================================================
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can view published blogs" ON blog_posts FOR SELECT USING (published = true);

-- ============================================================================
-- POLICIES FOR AUTHENTICATED ADMIN OPERATIONS
-- ============================================================================
CREATE POLICY "Admins can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert blogs" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update blogs" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete blogs" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete contact messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Sample Skills
INSERT INTO skills (name, icon, category, proficiency, visible) VALUES
('React', 'FaReact', 'Frontend', 90, true),
('Next.js', 'SiNextdotjs', 'Frontend', 85, true),
('TypeScript', 'SiTypescript', 'Language', 85, true),
('Node.js', 'FaNodeJs', 'Backend', 80, true),
('MongoDB', 'SiMongodb', 'Database', 75, true),
('PostgreSQL', 'SiPostgresql', 'Database', 70, true),
('Tailwind CSS', 'SiTailwindcss', 'Frontend', 90, true),
('Docker', 'SiDocker', 'DevOps', 65, true),
('Git', 'SiGit', 'Tool', 85, true),
('GraphQL', 'SiGraphql', 'API', 70, true)
ON CONFLICT DO NOTHING;

-- Sample Projects
INSERT INTO projects (title, description, tech_stack, github_link, live_link, featured, visible) VALUES
('E-Commerce Platform', 'Full-stack e-commerce with cart, checkout, and payment integration.', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'], 'https://github.com', 'https://demo.com', true, true),
('Portfolio Website', 'Modern portfolio with animations, dark mode, and CMS integration.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'https://github.com', 'https://demo.com', true, true),
('Task Management App', 'Collaborative task manager with real-time updates.', ARRAY['React', 'Firebase', 'Redux'], 'https://github.com', 'https://demo.com', true, true)
ON CONFLICT DO NOTHING;

-- Sample Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, published, author_name) VALUES
('Getting Started with Next.js 14', 'getting-started-nextjs-14', 'Learn how to build modern web applications with Next.js 14.', 'Full article content here...', true, 'Rohan'),
('Mastering TypeScript', 'mastering-typescript', 'A comprehensive guide to TypeScript for type-safe applications.', 'Full article content here...', true, 'Rohan'),
('React Best Practices', 'react-best-practices', 'Essential tips for writing clean, maintainable React code.', 'Full article content here...', true, 'Rohan')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CONFIRMATION
-- ============================================================================
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
