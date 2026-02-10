"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Code2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"


const navItems = [
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm py-3" 
          : "bg-background/95 border-transparent py-4"
      )}
    >
        <div className="container px-4 md:px-6 flex items-center justify-between">
            {/* Logo - Visible on all screens */}
            <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                    <Code2 className="h-7 w-7 md:h-8 md:w-8 text-primary relative z-10" />
                </motion.div>
                <span className="font-bold text-xl md:text-2xl tracking-tight">
                    DevFolio<span className="text-primary">.</span>
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="mr-4 hidden md:flex items-center flex-1 justify-end">
                <NavigationMenu>
                    <NavigationMenuList className="gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink 
                                    href={item.href}
                                    active={isActive}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "px-4 py-2 text-sm font-medium relative overflow-hidden group transition-colors",
                                        isActive && "bg-primary/10 text-primary"
                                    )}
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-primary/10 rounded-md -z-0"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    />
                                    <span className="relative z-10">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[320px] p-0">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b">
                                <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                                        <Code2 className="h-8 w-8 text-primary relative z-10" />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight">DevFolio</span>
                                </Link>
                            </div>
                            <nav className="flex-1 p-4 space-y-1">
                                {navItems.map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                isActive 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : "hover:bg-primary/10 hover:text-primary"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t space-y-2">
                                <Link href="/contact" onClick={() => setIsOpen(false)} className="block">
                                    <Button className="w-full" size="lg">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Let's Work Together
                                    </Button>
                                </Link>
                                <div className="flex justify-center pt-2">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </motion.header>
  )
}
