"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Code2, Sparkles, ArrowRight, Download, GraduationCap, Target, Lightbulb } from "lucide-react"

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

const itemVariants: Variants = {
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

const timelineItems = [
    { year: "2020", title: "Started Programming", description: "Began my journey with Python and fell in love with coding." },
    { year: "2021", title: "Web Development", description: "Learned HTML, CSS, JavaScript and built my first websites." },
    { year: "2022", title: "Full-Stack Journey", description: "Mastered React, Node.js and started building full-stack applications." },
    { year: "2023", title: "Professional Work", description: "Started working on client projects and expanded my skillset." },
    { year: "2024", title: "Continuous Growth", description: "Learning new technologies and building amazing projects." },
];

const values = [
    { icon: Lightbulb, title: "Innovation", description: "Always exploring new ways to solve problems creatively." },
    { icon: Target, title: "Precision", description: "Attention to detail ensures high-quality deliverables." },
    { icon: GraduationCap, title: "Learning", description: "Committed to continuous improvement and growth." },
];

export default function AboutPage() {
    return (
        <motion.div
            className="container mx-auto px-4 py-12 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-16">
                <Badge className="mb-4 px-4 py-1">About Me</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    My Journey as a <span className="gradient-text">Developer</span>
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl leading-relaxed">
                    I'm a passionate and self-motivated developer with a love for creating elegant and efficient solutions.
                </p>
            </motion.div>

            {/* Main Content */}
            <div className="grid gap-12 lg:grid-cols-2 items-start mb-20">
                <motion.div variants={itemVariants} className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold">My Story</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            My journey into the world of coding began with a simple "Hello, World!" and has since grown into a full-fledged passion for building real projects and solving complex problems. I'm a firm believer in lifelong learning and constantly seek out new challenges to expand my skillset.
                        </p>
                        <p>
                            What I can solve: I specialize in full-stack web development, with expertise in modern frameworks and libraries. I excel at building responsive and user-friendly frontends, designing and implementing robust backend APIs, and managing database systems efficiently.
                        </p>
                        <p>
                            My strengths include strong problem-solving abilities, unwavering consistency, and a relentless focus on delivering high-quality, real-world projects that make an impact.
                        </p>
                    </div>

                    {/* Values */}
                    <div className="grid gap-4 sm:grid-cols-3 mt-8">
                        {values.map((value) => (
                            <motion.div
                                key={value.title}
                                whileHover={{ scale: 1.02 }}
                                className="p-4 rounded-xl bg-card border hover:shadow-lg transition-all"
                            >
                                <value.icon className="h-8 w-8 text-primary mb-2" />
                                <h3 className="font-semibold">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                    <div className="relative aspect-square rounded-2xl overflow-hidden gradient-border p-1">
                        <div className="w-full h-full rounded-xl bg-card flex items-center justify-center overflow-hidden">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-card to-chart-2/10 relative"
                            >
                                <Avatar className="w-48 h-48 md:w-64 md:h-64 border-4 border-primary/20 shadow-2xl">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Rohan's Avatar" />
                                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">RP</AvatarFallback>
                                </Avatar>
                                <motion.div
                                    className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/80 backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                        <span className="font-medium">Full-Stack Developer</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                    {/* Floating Badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-primary text-primary-foreground shadow-lg"
                    >
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5" />
                            <span className="font-semibold">5+ Years Experience</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Timeline */}
            <motion.section variants={itemVariants} className="mb-20">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">My Journey</h2>
                <div className="relative">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-chart-2 to-transparent" />
                    <div className="space-y-8">
                        {timelineItems.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-start gap-4 md:gap-8 ${
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                }`}
                            >
                                <div className="flex-1 md:text-right">
                                    <div className={`p-4 rounded-xl bg-card border hover:shadow-lg transition-all ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        <Badge variant="outline" className="mb-2">{item.year}</Badge>
                                        <h3 className="font-semibold text-lg">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm">{item.description}</p>
                                    </div>
                                </div>
                                <div className="relative z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                                    <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                                </div>
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.div
                variants={itemVariants}
                className="text-center"
            >
                <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border">
                    <h2 className="text-2xl font-bold">Ready to Work Together?</h2>
                    <p className="text-muted-foreground max-w-md">
                        Let's collaborate on your next project and build something amazing.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="group">
                                Get in Touch
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/cv.pdf" target="_blank" download>
                            <Button size="lg" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download CV
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
