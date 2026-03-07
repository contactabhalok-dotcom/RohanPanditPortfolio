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
import { FileText, Plus, Edit, Trash2, Search, Eye, Calendar, Send } from "lucide-react"

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    meta_description?: string;
    published: boolean;
    created_at: string;
}

export default function BlogPostsPage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const res = await fetch("/api/blog");
            if (res.ok) {
                const data = await res.json();
                if (data.data?.blogPosts) {
                    setBlogPosts(data.data.blogPosts);
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

    const handleDelete = async (slug: string) => {
        try {
            const res = await fetch(`/api/blog/${slug}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchBlogPosts();
            } else {
                console.error("Failed to delete blog post");
            }
        } catch (error) {
                console.error("An error occurred while deleting blog post", error);
        }
    };

    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FileText className="h-12 w-12 text-primary animate-pulse" />
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
                    <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
                    <p className="text-muted-foreground">Manage your blog content.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Post
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Posts</p>
                            <p className="text-2xl font-bold">{blogPosts.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Eye className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Published</p>
                            <p className="text-2xl font-bold">{blogPosts.filter(p => p.published).length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                            <Send className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Drafts</p>
                            <p className="text-2xl font-bold">{blogPosts.filter(p => !p.published).length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Blog Posts Table */}
            <AnimatePresence mode="wait">
                {filteredPosts.length > 0 ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card className="border-0 shadow-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">Slug</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell>
                                                <div className="font-medium">{post.title}</div>
                                                <div className="md:hidden text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {post.slug}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                                    /blog/{post.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={post.published ? "default" : "secondary"}>
                                                    {post.published ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/blog/edit/${post.slug}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(post.slug)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? 'Try adjusting your search.' : 'Get started by writing your first post.'}
                        </p>
                        <Link href="/admin/blog/new">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Post
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
