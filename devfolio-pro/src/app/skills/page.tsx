"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaServer, FaCode } from 'react-icons/fa';
import { SiNextdotjs, SiMongodb, SiTailwindcss, SiExpress, SiJavascript, SiTypescript, SiHtml5, SiCss3, SiGit, SiGithub, SiPostman, SiVercel, SiFigma, SiDocker, SiRedis, SiGraphql, SiAmazon } from 'react-icons/si';
import { Code2, Sparkles, Zap, TrendingUp, CheckCircle2 } from "lucide-react";


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
    'figma': SiFigma,
    'docker': SiDocker,
    'redis': SiRedis,
    'graphql': SiGraphql,
    'aws': SiAmazon,
};

const categoryColors: { [key: string]: string } = {
    'Frontend': 'from-blue-500 to-cyan-500',
    'Backend': 'from-green-500 to-emerald-500',
    'Database': 'from-yellow-500 to-orange-500',
    'DevOps': 'from-purple-500 to-pink-500',
    'Tools': 'from-gray-500 to-gray-600',
    'default': 'from-primary to-chart-2',
};

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

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch("/api/skills");
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.skills) {
                        setSkills(data.data.skills.filter((skill: Skill) => skill.visible));
                    }
                } else {
                    console.error("Failed to fetch skills");
                }
            } catch (error) {
                console.error("An error occurred while fetching skills", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
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

    const skillsByCategory = skills.reduce((acc, skill) => {
        (acc[skill.category] = acc[skill.category] || []).push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const categories = Object.keys(skillsByCategory);
    const filteredCategories = selectedCategory
        ? [selectedCategory]
        : categories;

    const levelProgress = (level: string) => {
        switch(level) {
            case 'Advanced': return 90;
            case 'Intermediate': return 60;
            default: return 30;
        }
    };

    return (
        <motion.div
            className="container mx-auto px-4 py-12 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero */}
            <motion.div variants={itemVariants} className="text-center mb-16">
                <Badge className="mb-4 px-4 py-1">Skills & Expertise</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    My Technical <span className="gradient-text">Arsenal</span>
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl leading-relaxed text-balance">
                    A comprehensive overview of the technical tools, languages, and platforms I utilize in my development journey.
                </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    All Skills
                </motion.button>
                {categories.map((category) => (
                    <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        }`}
                    >
                        {category}
                    </motion.button>
                ))}
            </motion.div>

            {/* Skills Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedCategory || "all"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                >
                    {filteredCategories.map((category) => {
                        const categoryColor = categoryColors[category] || categoryColors['default'];
                        const skillList = skillsByCategory[category];

                        return (
                            <motion.div
                                key={category}
                                variants={containerVariants}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
                                        {category === 'Frontend' && <FaCode className="h-6 w-6" />}
                                        {category === 'Backend' && <FaServer className="h-6 w-6" />}
                                        {category === 'Database' && <FaDatabase className="h-6 w-6" />}
                                        {category === 'DevOps' && <SiDocker className="h-6 w-6" />}
                                        {category === 'Tools' && <SiGit className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{category}</h2>
                                        <p className="text-muted-foreground">{skillList.length} skills</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {skillList.map((skill) => {
                                        const Icon = iconMap[skill.name.toLowerCase()] || FaCode;
                                        return (
                                            <motion.div
                                                key={skill.id}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="relative p-6 rounded-xl bg-card border hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden group"
                                            >
                                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${categoryColor}`} />

                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${categoryColor}/10 group-hover:${categoryColor}/20 transition-colors`}>
                                                        <Icon className="w-6 h-6 text-foreground" />
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            skill.level === "Advanced" ? "default" :
                                                            skill.level === "Intermediate" ? "secondary" : "outline"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {skill.level}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-semibold text-lg mb-3">{skill.name}</h3>

                                                {/* Progress Bar */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>Proficiency</span>
                                                        <span>{levelProgress(skill.level)}%</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${levelProgress(skill.level)}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1, delay: 0.2 }}
                                                            className={`h-full rounded-full bg-gradient-to-r ${categoryColor}`}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Stats Section */}
            <motion.div
                variants={itemVariants}
                className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {[
                    { icon: Code2, label: "Projects Completed", value: "50+" },
                    { icon: Zap, label: "Technologies", value: skills.length },
                    { icon: TrendingUp, label: "Years Experience", value: "5+" },
                    { icon: CheckCircle2, label: "Happy Clients", value: "20+" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border text-center"
                    >
                        <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                        <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}
