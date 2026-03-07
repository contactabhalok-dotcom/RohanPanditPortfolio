"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Github, Linkedin, Twitter, Mail, ArrowUp, ArrowRight, Heart } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { icon: Github, href: "https://github.com/your-github", label: "GitHub" },
        { icon: Linkedin, href: "https://linkedin.com/in/your-linkedin", label: "LinkedIn" },
        { icon: Twitter, href: "https://twitter.com/your-twitter", label: "Twitter" },
        { icon: Mail, href: "mailto:your@email.com", label: "Email" },
    ]

    const footerLinks = [
        { title: "Explore", links: [
            { name: "About", href: "/about", external: false },
            { name: "Skills", href: "/skills", external: false },
            { name: "Projects", href: "/projects", external: false },
            { name: "Blog", href: "/blog", external: false },
            { name: "Contact", href: "/contact", external: false },
        ]},
        { title: "Connect", links: [
            { name: "GitHub", href: "https://github.com/your-github", external: true },
            { name: "LinkedIn", href: "https://linkedin.com/in/your-linkedin", external: true },
            { name: "Twitter", href: "https://twitter.com/your-twitter", external: true },
        ]},
    ]

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="relative overflow-hidden border-t bg-muted/30">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl" />
            </div>

            <div className="container relative py-16 md:py-24 px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                                <Code2 className="h-8 w-8 text-primary relative z-10" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">DevFolio</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Crafting exceptional digital experiences with modern technologies and thoughtful design.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-lg bg-background border hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                    <social.icon className="h-5 w-5" />
                                    <span className="sr-only">{social.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Sections */}
                    {footerLinks.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (sectionIndex + 1) * 0.1 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-lg">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        © {currentYear} DevFolio. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                        <span>by Rohan</span>
                    </div>
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </motion.button>
                </motion.div>
            </div>
        </footer>
    )
}
