"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tech_stack: z.string().min(1, { message: "Tech Stack is required" }),
  github_link: z.string().optional(),
  live_link: z.string().optional(),
  featured: z.boolean().default(false).optional(),
  images: z.array(z.string()).optional(),
});

interface ProjectFormProps {
    initialData?: z.infer<typeof formSchema>;
    projectId?: string;
}

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            tech_stack: "",
            github_link: "",
            live_link: "",
            featured: false,
            images: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
            setImages(initialData.images || []);
        }
    }, [initialData, form]);

    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'projects');
        
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
        } catch {
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setUploading(true);
        const uploadedUrls: string[] = [];
        
        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) {
                uploadedUrls.push(url);
            }
        }
        
        setImages([...images, ...uploadedUrls]);
        setUploading(false);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    async function handleSave() {
        const values = form.getValues();
        
        setError("");
        setLoading(true);

        const processedValues = {
            title: values.title,
            description: values.description,
            tech_stack: values.tech_stack.split(',').map(item => item.trim()).filter(Boolean),
            github_link: values.github_link || "",
            live_link: values.live_link || "",
            featured: values.featured || false,
            visible: true,
            images: images,
        }

        try {
            let res;
            if (projectId) {
                res = await fetch(`/api/projects/${projectId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processedValues),
                });
            } else {
                res = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processedValues),
                });
            }

            if (res.ok) {
                router.push("/admin/projects");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to save project");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <div className="space-y-8">
                {error && (
                    <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-600">
                        {error}
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Project title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Project description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tech_stack"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tech Stack (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="React, Next.js, Tailwind CSS" {...field} />
                            </FormControl>
                            <FormDescription>
                                Comma separated technologies used in the project.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="github_link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://github.com/your/project" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="live_link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Live Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://your-project.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Featured Project
                                </FormLabel>
                                <FormDescription>
                                    Check this box to mark the project as featured on the homepage.
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Project Images</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="cursor-pointer"
                                        disabled={uploading}
                                        asChild
                                    >
                                        <span className="flex items-center gap-2">
                                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            {uploading ? "Uploading..." : "Upload Images"}
                                        </span>
                                    </Button>
                                </label>
                            </div>
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img 
                                                src={url} 
                                                alt={`Project image ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <FormDescription>
                                Upload project screenshots or images (PNG, JPG, WebP)
                            </FormDescription>
                        </div>
                    </FormControl>
                </FormItem>
                <Button type="button" onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save"}
                </Button>
            </div>
        </Form>
    );
}
