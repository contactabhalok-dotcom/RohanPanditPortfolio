"use client";

import { SkillForm } from "@/components/SkillForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(2, {
      message: "Skill name must be at least 2 characters.",
    }),
    category: z.string().min(2, {
      message: "Category must be at least 2 characters.",
    }),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    icon: z.string().optional(),
    visible: z.boolean().default(true).optional(),
  });

export default function EditSkillPage() {
    const { id } = useParams();
    const [initialData, setInitialData] = useState<z.infer<typeof formSchema> | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSkill() {
            try {
                const res = await fetch(`/api/skills/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInitialData(data.data.skill);
                } else {
                    console.error("Failed to fetch skill");
                }
            } catch (error) {
                console.error("An error occurred while fetching skill", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchSkill();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Loading Skill...</h2>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Skill</h2>
            </div>
            <SkillForm initialData={initialData} skillId={id as string} />
        </div>
    );
}
