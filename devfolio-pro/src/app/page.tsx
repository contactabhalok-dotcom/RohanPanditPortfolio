"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Typewriter from 'typewriter-effect';
import { FaReact, FaNodeJs, FaDatabase, FaServer, FaArrowRight, FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { SiNextdotjs, SiMongodb, SiTailwindcss, SiExpress, SiJavascript, SiTypescript, SiHtml5, SiCss3, SiGit, SiGithub, SiPostman, SiVercel } from 'react-icons/si';
import { Code2, Sparkles, Zap, Trophy, Rocket, Globe } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    github_link?: string;
    live_link?: string;
    images?: string[];
    featured: boolean;
    created_at: string;
}

interface Skill {
    id: string;
    name: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    icon?: string;
    visible: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
    'react': FaReact,
    'next.js': SiNextdotjs,
    'node.js': FaNodeJs,
    'mongodb': SiMongodb,
    'tailwind css': SiTailwindcss,
    'express': SiExpress,
    'javascript': SiJavascript,
    'typescript': SiTypescript,
    'html5': SiHtml5,
    'css3': SiCss3,
    'git': SiGit,
    'github': SiGithub,
    'postman': SiPostman,
    'vercel': SiVercel,
    'database': FaDatabase,
    'server': FaServer,
    'code': FaCode,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 20,
        },
    },
};

const floatingShapes = [
    { x: 5, y: 10, size: 400, color: "primary/5", delay: 0 },
    { x: 85, y: 15, size: 300, color: "chart-2/5", delay: 0.5 },
    { x: 15, y: 75, size: 350, color: "chart-3/5", delay: 1 },
    { x: 75, y: 85, size: 250, color: "chart-4/5", delay: 1.5 },
];

const techStack = [
    { icon: FaReact, name: "React", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: SiNextdotjs, name: "Next.js", color: "text-gray-800 dark:text-gray-200", bg: "bg-gray-500/10" },
    { icon: FaNodeJs, name: "Node.js", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600", bg: "bg-blue-600/10" },
    { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { icon: SiMongodb, name: "MongoDB", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const stats = [
    { icon: Trophy, label: "Projects Completed", value: "50+", color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Code2, label: "Technologies", value: "20+", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Zap, label: "Years Experience", value: "5+", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Globe, label: "Happy Clients", value: "30+", color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function Home() {
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [techSkills, setTechSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsRes = await fetch("/api/projects");
                const projectsData = await projectsRes.json();
                if (projectsData.data?.projects) {
                    setFeaturedProjects(projectsData.data.projects.filter((project: Project) => project.featured).slice(0, 3));
                }

                const skillsRes = await fetch("/api/skills");
                const skillsData = await skillsRes.json();
                if (skillsData.data?.skills) {
                    setTechSkills(skillsData.data.skills.filter((skill: Skill) => skill.visible));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Code2 className="h-16 w-16 text-primary animate-pulse" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-lg text-muted-foreground font-medium"
                >
                    Loading amazing content...
                </motion.p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {floatingShapes.map((shape, index) => (
                            <motion.div
                                key={index}
                                className={`absolute rounded-full blur-3xl opacity-30`}
                                style={{
                                    left: `${shape.x}%`,
                                    top: `${shape.y}%`,
                                    width: shape.size,
                                    height: shape.size,
                                    background: `oklch(var(--${shape.color.split('/')[0]}) / 0.15)`,
                                }}
                                animate={{
                                    x: [0, 40, 0],
                                    y: [0, -40, 0],
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: shape.delay,
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        style={{ y }}
                        className="container px-4 md:px-6 text-center relative z-10"
                    >
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Badge */}
                            <motion.div variants={itemVariants} className="mb-6">
                                <Badge className="px-5 py-2 text-sm font-medium border-primary/30 bg-primary/10 backdrop-blur-sm shadow-sm text-primary">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Available for freelance work
                                </Badge>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                                <span className="block">Hello, I'm</span>
                                <span className="block bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
                                    Rohan
                                </span>
                            </motion.h1>

                            {/* Typewriter */}
                            <motion.div variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 h-10 flex items-center justify-center">
                                <Typewriter
                                    options={{
                                        strings: ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Tech Lead'],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </motion.div>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="mx-auto max-w-2xl text-muted-foreground md:text-lg leading-relaxed mb-10"
                            >
                                I design and build beautiful, performant, and accessible web applications that help businesses grow and succeed in the digital world.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <Link href="/contact">
                                    <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                                        <Rocket className="mr-2 h-5 w-5" />
                                        Start a Project
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-2">
                                        View My Work
                                        <FaArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Tech Stack Preview with Scroll Animation */}
                            <motion.div variants={itemVariants} className="mt-12">
                                <p className="text-sm text-muted-foreground mb-6 font-medium">POWERED BY</p>
                                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                    {techStack.map((tech) => (
                                        <motion.div
                                            key={tech.name}
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${tech.bg} border`}
                                        >
                                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                                            <span className="text-sm font-medium">{tech.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Scroll Animation to Next Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-12 flex flex-col items-center"
                                >
                                    <motion.div
                                        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="cursor-pointer"
                                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Explore</span>
                                            <div className="w-6 h-10 rounded-full border border-muted-foreground/30 flex justify-center pt-2">
                                                <motion.div
                                                    animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="w-1 h-1 rounded-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
                    >
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
                            <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-2">
                                <motion.div
                                    animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1 h-1 rounded-full bg-primary"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Spacer */}
                <div className="h-4" />

                {/* Stats Section */}
                <section className="py-16 bg-muted/30 -mt-4">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -3 }}
                                    className="text-center p-4 rounded-xl bg-card border hover:shadow-md transition-all"
                                >
                                    <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Preview */}
                <section className="py-24 md:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-2/20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center"
                                        >
                                            <Code2 className="w-24 h-24 md:w-32 md:h-32 text-primary/50" />
                                        </motion.div>
                                    </div>
                                    {/* Floating cards */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute top-6 right-6 p-4 rounded-xl bg-card/90 backdrop-blur shadow-lg border"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-amber-500" />
                                            <span className="font-semibold">Fast & Performant</span>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="absolute bottom-6 left-6 p-4 rounded-xl bg-card/90 backdrop-blur shadow-lg border"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-green-500" />
                                            <span className="font-semibold">Award Winning</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <Badge className="w-fit">About Me</Badge>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                                    Passionate About Creating <span className="gradient-text">Digital Experiences</span>
                                </h2>
                                <p className="text-muted-foreground md:text-lg leading-relaxed">
                                    I'm a self-taught developer with a deep passion for creating software that solves real-world problems. My journey into web development started with curiosity and has evolved into a full-time dedication to building high-quality, user-centric applications.
                                </p>
                                <p className="text-muted-foreground md:text-lg leading-relaxed">
                                    I specialize in full-stack development, from responsive frontends with React & Next.js to robust backend APIs with Node.js and database management with PostgreSQL & MongoDB.
                                </p>
                                <Link href="/about">
                                    <Button className="mt-4 h-11" variant="outline">
                                        Learn More About Me
                                        <FaArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Featured Projects */}
                <section className="py-24 md:py-32 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4">Featured Work</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Projects I'm <span className="gradient-text">Proud Of</span>
                            </h2>
                            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                                A selection of projects that showcase my skills and passion for development.
                            </p>
                        </motion.div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {featuredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Card className="h-full overflow-hidden card-hover border-0 shadow-lg bg-card">
                                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-chart-2/10 relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Code2 className="w-20 h-20 text-primary/20" />
                                            </div>
                                            {project.featured && (
                                                <div className="absolute top-4 right-4">
                                                    <Badge variant="secondary" className="bg-primary/10">
                                                        <Trophy className="h-3 w-3 mr-1" />
                                                        Featured
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tech_stack.slice(0, 4).map((tech) => (
                                                    <Badge key={tech} variant="secondary" className="text-xs">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                                {project.tech_stack.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{project.tech_stack.length - 4}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between gap-2 pt-4 border-t">
                                            {project.github_link && (
                                                <Link href={project.github_link} target="_blank" className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full gap-2">
                                                        <FaGithub className="h-4 w-4" />
                                                        Code
                                                    </Button>
                                                </Link>
                                            )}
                                            {project.live_link && (
                                                <Link href={project.live_link} target="_blank" className="flex-1">
                                                    <Button size="sm" className="w-full gap-2">
                                                        <FaExternalLinkAlt className="h-3 w-3" />
                                                        Demo
                                                    </Button>
                                                </Link>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex justify-center mt-12"
                        >
                            <Link href="/projects">
                                <Button size="lg" variant="outline" className="gap-2">
                                    View All Projects
                                    <FaArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 md:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-chart-2/5" />
                    <div className="container relative px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <Badge className="mb-6">Get In Touch</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                                Let's Build Something <span className="gradient-text">Amazing Together</span>
                            </h2>
                            <p className="text-muted-foreground md:text-lg mb-8">
                                Have a project in mind or just want to connect? I'd love to hear from you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <Button size="lg" className="h-12 px-8 text-base shadow-lg">
                                        <Rocket className="mr-2 h-5 w-5" />
                                        Start a Conversation
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                                        More About Me
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
