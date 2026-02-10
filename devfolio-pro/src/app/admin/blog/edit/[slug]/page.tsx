"use client";

import { BlogPostForm } from "@/components/BlogPostForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as z from "zod";

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
      message: "Slug must be at least 2 characters.",
    }),
    content: z.string().min(10, {
      message: "Content must be at least 10 characters.",
    }),
    meta_description: z.string().optional(),
    published: z.boolean().default(false).optional(),
  });

export default function EditBlogPostPage() {
    const { slug } = useParams();
    const [initialData, setInitialData] = useState<z.infer<typeof formSchema> | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogPost() {
            try {
                const res = await fetch(`/api/blog/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setInitialData(data.data.blogPost);
                } else {
                    console.error("Failed to fetch blog post");
                }
            } catch (error) {
                console.error("An error occurred while fetching blog post", error);
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
            <div className="flex-1 space-y-4 p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Loading Blog Post...</h2>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
            </div>
            <BlogPostForm initialData={initialData} blogSlug={slug as string} />
        </div>
    );
}