"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Plus, Edit, Trash2, Search, TrendingUp, Layers, Award } from "lucide-react"

interface Skill {
    id: string;
    name: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    icon?: string;
    visible: boolean;
}

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/skills");
            if (res.ok) {
                const data = await res.json();
                if (data.data?.skills) {
                    setSkills(data.data.skills);
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

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/skills/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchSkills();
            } else {
                console.error("Failed to delete skill");
            }
        } catch (error) {
            console.error("An error occurred while deleting skill", error);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const skillsByCategory = filteredSkills.reduce((acc, skill) => {
        (acc[skill.category] = acc[skill.category] || []).push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const levelCount = {
        Advanced: skills.filter(s => s.level === "Advanced").length,
        Intermediate: skills.filter(s => s.level === "Intermediate").length,
        Beginner: skills.filter(s => s.level === "Beginner").length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
                    <p className="text-muted-foreground">Manage your technical skills.</p>
                </div>
                <Link href="/admin/skills/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Skill
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Layers className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Skills</p>
                            <p className="text-2xl font-bold">{skills.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Award className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Advanced</p>
                            <p className="text-2xl font-bold">{levelCount.Advanced}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                            <TrendingUp className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Intermediate</p>
                            <p className="text-2xl font-bold">{levelCount.Intermediate}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-500/10">
                            <Code2 className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Beginner</p>
                            <p className="text-2xl font-bold">{levelCount.Beginner}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Skills Grid by Category */}
            <AnimatePresence mode="wait">
                {filteredSkills.length > 0 ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {category}
                                    <Badge variant="secondary">{categorySkills.length}</Badge>
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {categorySkills.map((skill) => (
                                        <motion.div
                                            key={skill.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center justify-between p-3 rounded-lg bg-card border hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={
                                                        skill.level === "Advanced" ? "default" :
                                                        skill.level === "Intermediate" ? "secondary" : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {skill.level}
                                                </Badge>
                                                <span className="font-medium">{skill.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Link href={`/admin/skills/edit/${skill.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(skill.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Code2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No skills found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? 'Try adjusting your search.' : 'Get started by adding your first skill.'}
                        </p>
                        <Link href="/admin/skills/new">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Skill
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
