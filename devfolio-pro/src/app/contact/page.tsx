"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"
import { Code2, Mail, MapPin, Send, MessageSquare, Github, Linkedin, Twitter } from "lucide-react"

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
    hidden: { opacity: 0, y: 30 },
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

const contactInfo = [
    { icon: Mail, title: "Email", value: "your@email.com", href: "mailto:your@email.com" },
    { icon: MapPin, title: "Location", value: "Your City, Country" },
    { icon: Github, title: "GitHub", value: "github.com/your-github", href: "https://github.com/your-github" },
];

const socialLinks = [
    { icon: Github, href: "https://github.com/your-github", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/your-linkedin", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/your-twitter", label: "Twitter" },
];

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setStatus("success");
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("An error occurred.", error);
            setStatus("error");
        }
    };

    return (
        <motion.div
            className="container mx-auto px-4 py-12 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero */}
            <motion.div variants={itemVariants} className="text-center mb-16">
                <Badge className="mb-4 px-4 py-1">Contact</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    Get In <span className="gradient-text">Touch</span>
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl leading-relaxed text-balance">
                    Have a question or want to work together? I'd love to hear from you.
                </p>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl">Send a Message</CardTitle>
                            <CardDescription>
                                Fill out the form below and I'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="transition-all focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="transition-all focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What's this about?"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        className="transition-all focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="min-h-[150px] resize-none transition-all focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full group"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="mr-2 h-4 w-4"
                                            >
                                                <Code2 className="h-4 w-4" />
                                            </motion.div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                                {status === "success" && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-green-500 text-sm text-center flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        Message sent successfully! I'll get back to you soon.
                                    </motion.p>
                                )}
                                {status === "error" && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm text-center"
                                    >
                                        Failed to send message. Please try again or email me directly.
                                    </motion.p>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Info */}
                <motion.div variants={itemVariants} className="space-y-6">
                    {/* Contact Details */}
                    <div className="space-y-4">
                        {contactInfo.map((info) => (
                            <motion.div
                                key={info.title}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-lg transition-all"
                            >
                                <div className="p-3 rounded-full bg-primary/10">
                                    <info.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{info.title}</p>
                                    {info.href ? (
                                        <a
                                            href={info.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium hover:text-primary transition-colors"
                                        >
                                            {info.value}
                                        </a>
                                    ) : (
                                        <p className="font-medium">{info.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-4 rounded-full bg-card border hover:bg-primary/10 hover:border-primary/50 transition-all group"
                                >
                                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="sr-only">{social.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Availability Status */}
                    <Card className="bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 w-3 h-3 rounded-full bg-primary"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">Available for work</p>
                                    <p className="text-sm text-muted-foreground">
                                        Currently accepting new projects and collaborations.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}
