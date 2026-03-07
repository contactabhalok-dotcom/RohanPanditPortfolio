"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Calendar, Trash2, Search, MessageSquare } from "lucide-react"

interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string
    message: string
    created_at: string
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
    },
}

export default function ContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/contact")
            if (res.ok) {
                const data = await res.json()
                if (data.data?.messages) {
                    setMessages(data.data.messages)
                }
            }
        } catch (error) {
            console.error("Failed to fetch messages", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        
        try {
            const res = await fetch(`/api/contact?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setMessages(messages.filter(msg => msg.id !== id));
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contact Messages</h2>
                    <p className="text-muted-foreground">Messages from your website visitors</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-background text-sm w-64"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{messages.length}</div>
                    </CardContent>
                </Card>
            </div>

            {filteredMessages.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No messages yet</p>
                        <p className="text-sm text-muted-foreground">Messages from the contact form will appear here</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            variants={itemVariants}
                            layout
                        >
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedMessage(msg)}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{msg.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" />
                                                {msg.email}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(msg.created_at)}
                                        </Badge>
                                    </div>
                                    {msg.subject && (
                                        <p className="font-medium text-sm mt-2">{msg.subject}</p>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">{selectedMessage.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Mail className="h-3 w-3" />
                                        {selectedMessage.email}
                                    </CardDescription>
                                    {selectedMessage.subject && (
                                        <p className="font-medium mt-2">{selectedMessage.subject}</p>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(selectedMessage.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {formatDate(selectedMessage.created_at)}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                            <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`mailto:${selectedMessage.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Reply
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </motion.div>
    )
}
