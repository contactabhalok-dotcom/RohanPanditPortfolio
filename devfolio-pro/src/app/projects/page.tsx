"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ExternalLink, Github, Eye, EyeOff, Calendar, ArrowRight, Filter } from "lucide-react";

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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

const techColors: { [key: string]: string } = {
    'react': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'next.js': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    'node.js': 'bg-green-500/10 text-green-500 border-green-500/20',
    'mongodb': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'tailwind css': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    'express': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    'javascript': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'typescript': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'default': 'bg-primary/10 text-primary border-primary/20',
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.projects) {
                        setProjects(data.data.projects);
                    }
                } else {
                    console.error("Failed to fetch projects");
                }
            } catch (error) {
                console.error("An error occurred while fetching projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24 flex items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Code2 className="h-12 w-12 text-primary animate-pulse" />
                </motion.div>
            </div>
        );
    }

    const filteredProjects = filter === 'featured'
        ? projects.filter(p => p.featured)
        : projects;

    return (
        <motion.div
            className="container mx-auto px-4 py-12 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero */}
            <motion.div variants={itemVariants} className="text-center mb-12">
                <Badge className="mb-4 px-4 py-1">Portfolio</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    My <span className="gradient-text">Projects</span>
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl leading-relaxed text-balance">
                    A collection of my recent work, showcasing my skills and passion for development.
                </p>
            </motion.div>

            {/* Filter */}
            <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-12">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === 'all'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    <Filter className="h-4 w-4" />
                    All Projects
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter('featured')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === 'featured'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    <Eye className="h-4 w-4" />
                    Featured
                </motion.button>
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={filter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden card-hover border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                                {/* Project Image/Preview */}
                                <div className="aspect-video bg-gradient-to-br from-primary/10 via-muted/50 to-chart-2/10 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Code2 className="w-16 h-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
                                    </div>
                                    {project.featured && (
                                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Featured
                                        </Badge>
                                    )}
                                    {/* Hover Overlay */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity"
                                    >
                                        {project.github_link && (
                                            <Link href={project.github_link} target="_blank">
                                                <Button variant="secondary" size="sm" className="gap-2">
                                                    <Github className="h-4 w-4" />
                                                    Code
                                                </Button>
                                            </Link>
                                        )}
                                        {project.live_link && (
                                            <Link href={project.live_link} target="_blank">
                                                <Button size="sm" className="gap-2">
                                                    <ExternalLink className="h-4 w-4" />
                                                    Demo
                                                </Button>
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.slice(0, 5).map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className={`text-xs ${
                                                    techColors[tech.toLowerCase().replace(' ', '-')] || techColors['default']
                                                }`}
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.tech_stack.length > 5 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{project.tech_stack.length - 5}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(project.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex gap-2">
                                        {project.github_link && (
                                            <Link href={project.github_link} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Github className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {project.live_link && (
                                            <Link href={project.live_link} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-20"
                >
                    <Code2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">
                        {filter === 'featured'
                            ? 'There are no featured projects at the moment.'
                            : 'There are no projects to display.'}
                    </p>
                </motion.div>
            )}

            {/* CTA */}
            <motion.div
                variants={itemVariants}
                className="mt-20 text-center"
            >
                <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border">
                    <h2 className="text-2xl font-bold">Interested in Working Together?</h2>
                    <p className="text-muted-foreground max-w-md">
                        Let's discuss your project and see how we can bring your ideas to life.
                    </p>
                    <Link href="/contact">
                        <Button className="gap-2">
                            Start a Project
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    )
}
