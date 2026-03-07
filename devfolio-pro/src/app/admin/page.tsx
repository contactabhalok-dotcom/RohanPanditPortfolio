"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { motion, Variants } from "framer-motion"
import { Code2, FolderCode, UserCog, FileText, TrendingUp, Calendar, ArrowUpRight, Eye } from "lucide-react"
import Link from "next/link"

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
    hidden: { opacity: 0, y: 20 },
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

const statsCards = [
    {
        title: "Total Projects",
        value: "12",
        icon: FolderCode,
        trend: "+2 this month",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        href: "/admin/projects",
    },
    {
        title: "Skills",
        value: "24",
        icon: Code2,
        trend: "+5 this month",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        href: "/admin/skills",
    },
    {
        title: "Blog Posts",
        value: "8",
        icon: FileText,
        trend: "+1 this week",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        href: "/admin/blog",
    },
];

const quickActions = [
    { title: "Add Project", href: "/admin/projects/new", icon: FolderCode, color: "bg-blue-500/10 text-blue-500" },
    { title: "Add Skill", href: "/admin/skills/new", icon: Code2, color: "bg-green-500/10 text-green-500" },
    { title: "Write Blog Post", href: "/admin/blog/new", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
];

export default function AdminDashboard() {
    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={itemVariants}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
                {statsCards.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="card-hover cursor-pointer border-0 shadow-md bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    {stat.trend}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                {quickActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                        <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className={`p-3 rounded-lg ${action.color}`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{action.title}</p>
                                <p className="text-xs text-muted-foreground">Click to add new</p>
                            </div>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest updates and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "New project added", description: "E-commerce Platform", time: "2 hours ago", icon: FolderCode, color: "text-blue-500" },
                                { title: "Blog post published", description: "React Best Practices", time: "1 day ago", icon: FileText, color: "text-purple-500" },
                                { title: "Skill updated", description: "TypeScript - Advanced", time: "3 days ago", icon: Code2, color: "text-green-500" },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg ${activity.color}/10`}>
                                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {activity.time}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
