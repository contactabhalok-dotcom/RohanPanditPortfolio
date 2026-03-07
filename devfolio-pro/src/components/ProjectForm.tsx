"use client";

import { useState } from "react";
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  tech_stack: z.string().min(2, {
    message: "Tech Stack must be at least 2 characters.",
  }),
  github_link: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  live_link: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  featured: z.boolean().default(false).optional(),
});

interface ProjectFormProps {
    initialData?: z.infer<typeof formSchema>;
    projectId?: string;
}

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            tech_stack: "",
            github_link: "",
            live_link: "",
            featured: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError("");
        setLoading(true);

        const processedValues = {
            ...values,
            tech_stack: values.tech_stack.split(',').map(item => item.trim()).filter(Boolean),
            visible: true,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}