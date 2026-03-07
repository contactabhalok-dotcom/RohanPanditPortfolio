"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";

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
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};


export default function SingleBlogPostPage() {
    const { slug } = useParams();
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogPost() {
            try {
                const res = await fetch(`/api/blog/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.data.blogPost.published) {
                        setBlogPost(data.data.blogPost);
                    } else {
                        // Handle case where blog post is not published
                        setBlogPost(null);
                    }
                } else {
                    console.error("Failed to fetch blog post");
                    setBlogPost(null);
                }
            } catch (error) {
                console.error("An error occurred while fetching blog post", error);
                setBlogPost(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchBlogPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24 flex items-center justify-center">
                <p>Loading Blog Post...</p>
            </div>
        );
    }

    if (!blogPost) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">Blog Post Not Found</h1>
                <p className="mt-4 text-muted-foreground">The blog post you are looking for does not exist or is not published.</p>
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
            <article className="mx-auto max-w-4xl">
                <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4 text-foreground">
                    {blogPost.title}
                </motion.h1>
                <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-8">
                    Published on {new Date(blogPost.created_at).toLocaleDateString()}
                </motion.p>
                <motion.div variants={itemVariants} className="prose dark:prose-invert max-w-none text-foreground">
                    <ReactMarkdown>{blogPost.content}</ReactMarkdown>
                </motion.div>
            </article>
        </motion.div>
    )
}
