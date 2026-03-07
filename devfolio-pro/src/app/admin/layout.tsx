"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  FolderCode,
  Code2,
  FileText,
  Menu,
  LogOut,
  Package2,
  Bell,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderCode, label: "Projects" },
    { href: "/admin/skills", icon: Code2, label: "Skills" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Package2 className="h-8 w-8 text-primary animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] bg-muted/30">
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring" as const, stiffness: 100 }}
        className="hidden border-r bg-card md:block sticky top-0 h-screen overflow-y-auto"
      >
        <div className="flex h-full max-h-screen flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <Package2 className="h-7 w-7 text-primary relative z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-1 px-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-2 w-2 rounded-full bg-primary-foreground"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.email?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.user_metadata?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Header & Content */}
      <div className="flex flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-[280px]">
              <div className="flex items-center gap-2 font-semibold mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                  <Package2 className="h-6 w-6 text-primary relative z-10" />
                </div>
                <span className="text-lg">Admin Panel</span>
              </div>
              <nav className="grid gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-4 border-t space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.email?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex items-center justify-end gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>

            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
