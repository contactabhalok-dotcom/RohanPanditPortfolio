"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Calendar, ArrowRight, Eye, Clock, BookOpen } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    meta_description?: string;
    published: boolean;
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

const readingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await fetch("/api/blog");
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.blogPosts) {
                        setBlogPosts(data.data.blogPosts.filter((post: BlogPost) => post.published));
                    }
                } else {
                    console.error("Failed to fetch blog posts");
                }
            } catch (error) {
                console.error("An error occurred while fetching blog posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogPosts();
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

    return (
        <motion.div
            className="container mx-auto px-4 py-12 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero */}
            <motion.div variants={itemVariants} className="text-center mb-16">
                <Badge className="mb-4 px-4 py-1">Blog</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    My <span className="gradient-text">Blog</span>
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl leading-relaxed text-balance">
                    Thoughts, learnings, and experiences in software development.
                </p>
            </motion.div>

            {/* Featured Post */}
            {blogPosts.length > 0 && (
                <motion.div variants={itemVariants} className="mb-16">
                    <Link href={`/blog/${blogPosts[0].slug}`} className="block">
                        <Card className="overflow-hidden card-hover border-0 shadow-lg bg-gradient-to-br from-primary/10 via-card to-chart-2/10">
                            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                                <div className="flex flex-col justify-center space-y-4">
                                    <Badge className="w-fit">Featured Article</Badge>
                                    <h2 className="text-2xl md:text-3xl font-bold hover:text-primary transition-colors">
                                        {blogPosts[0].title}
                                    </h2>
                                    <p className="text-muted-foreground line-clamp-3">
                                        {blogPosts[0].meta_description || blogPosts[0].content.substring(0, 200) + "..."}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(blogPosts[0].created_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {readingTime(blogPosts[0].content)} min read
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="p-8 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20">
                                        <BookOpen className="w-16 h-16 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            )}

            {/* Blog Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="blog-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {blogPosts.slice(1).map((post) => (
                        <motion.div key={post.id} variants={itemVariants}>
                            <Link href={`/blog/${post.slug}`}>
                                <Card className="h-full overflow-hidden card-hover border-0 shadow-md bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all group">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                Article
                                            </Badge>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {readingTime(post.content)} min read
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {post.meta_description || post.content.substring(0, 100) + "..."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <motion.span
                                                className="flex items-center gap-1 text-sm text-primary font-medium"
                                                whileHover={{ x: 5 }}
                                            >
                                                Read more
                                                <ArrowRight className="h-4 w-4" />
                                            </motion.span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {blogPosts.length === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-20"
                >
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Check back soon for new articles and tutorials.
                    </p>
                </motion.div>
            )}

            {/* Newsletter / CTA */}
            <motion.div
                variants={itemVariants}
                className="mt-20"
            >
                <Card className="bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-0">
                    <div className="p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Subscribe to get notified when I publish new articles and tutorials.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="gap-2">
                                    Get in Touch
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}
