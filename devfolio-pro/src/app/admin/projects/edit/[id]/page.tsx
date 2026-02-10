"use client";

import { ProjectForm } from "@/components/ProjectForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as z from "zod";

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
    images: z.string().optional(),
    featured: z.boolean().default(false).optional(),
});

export default function EditProjectPage() {
    const { id } = useParams();
    const [initialData, setInitialData] = useState<z.infer<typeof formSchema> | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInitialData({
                        ...data.data.project,
                        tech_stack: data.data.project.tech_stack.join(", "),
                        images: data.data.project.images.join(", "),
                    });
                } else {
                    console.error("Failed to fetch project");
                }
            } catch (error) {
                console.error("An error occurred while fetching project", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Loading Project...</h2>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
            </div>
            <ProjectForm initialData={initialData} projectId={id as string} />
        </div>
    );
}