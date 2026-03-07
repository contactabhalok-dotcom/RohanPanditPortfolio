"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

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
  image: z.string().optional(),
});

interface BlogPostFormProps {
    initialData?: z.infer<typeof formSchema>;
    blogSlug?: string;
}

export function BlogPostForm({ initialData, blogSlug }: BlogPostFormProps) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(initialData?.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: "",
            slug: "",
            content: "",
            meta_description: "",
            published: false,
            image: "",
        },
    });

    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'blog');
        
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                return data.url;
            }
            return null;
        } catch (err) {
            console.error('Upload error:', err);
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploading(true);
        const url = await uploadImage(file);
        
        if (url) {
            setImage(url);
        }
        setUploading(false);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = () => {
        setImage("");
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const body = { ...values, image };
            let res;
            if (blogSlug) {
                res = await fetch(`/api/blog/${blogSlug}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch("/api/blog", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
            }

            if (res.ok) {
                router.push("/admin/blog");
            } else {
                const data = await res.json();
                console.error(data.message || "An error occurred.");
            }
        } catch (error) {
            console.error("An error occurred.", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Blog post title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="blog-post-slug" {...field} />
                            </FormControl>
                            <FormDescription>
                                The URL-friendly version of the title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea rows={10} placeholder="Write your blog post here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description for SEO" {...field} />
                            </FormControl>
                            <FormDescription>
                                A short summary of the blog post for search engines.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Published
                                </FormLabel>
                                <FormDescription>
                                    Toggle to make the blog post public or draft.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="blog-image-upload"
                                />
                                <label htmlFor="blog-image-upload">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="cursor-pointer"
                                        disabled={uploading}
                                        asChild
                                    >
                                        <span className="flex items-center gap-2">
                                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            {uploading ? "Uploading..." : "Upload Image"}
                                        </span>
                                    </Button>
                                </label>
                            </div>
                            {image && (
                                <div className="relative group inline-block">
                                    <img 
                                        src={image} 
                                        alt="Blog cover"
                                        className="w-full max-w-md h-48 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <FormDescription>
                                Upload a cover image for the blog post (PNG, JPG, WebP)
                            </FormDescription>
                        </div>
                    </FormControl>
                </FormItem>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}