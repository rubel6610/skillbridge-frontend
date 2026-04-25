"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const getUserMenuItems = (role?: string) => {
  if (role === "TUTOR") {
    return [{ label: "Tutor Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard }];
  }
  if (role === "ADMIN") {
    return [{ label: "Admin Panel", href: "/admin", icon: LayoutDashboard }];
  }
  return [{ label: "Student Dashboard", href: "/student/dashboard", icon: LayoutDashboard }];
};

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsUserMenuOpen(false);
  };

  const userMenuItems = getUserMenuItems(user?.role);
  const isTutor = user?.role === "TUTOR";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-[24px] border border-white/20 transition-all duration-300 px-6",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 py-3" 
            : "bg-white/40 backdrop-blur-md py-4"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/tutors"
                className={cn(
                  "text-sm font-bold transition-all hover:text-indigo-600",
                  pathname === "/tutors" ? "text-indigo-600" : "text-slate-600"
                )}
              >
                Find Tutors
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-bold text-slate-600 transition-all hover:text-indigo-600"
              >
                How it Works
              </Link>
              {/* Hide Become a Tutor if already a tutor */}
              {!isTutor && (
                <Link
                  href="/register"
                  className={cn(
                    "text-sm font-bold transition-all hover:text-indigo-600",
                    pathname === "/register" ? "text-indigo-600" : "text-slate-600"
                  )}
                >
                  Become a Tutor
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Hide search for tutors */}
            {!isTutor && (
              <Link href="/tutors" className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors p-2">
                <Search size={18} />
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-white transition-all hover:bg-slate-800"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold uppercase">
                    {user?.name?.[0] || "U"}
                  </div>
                  <span className="hidden md:block text-xs font-bold">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-[24px] border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-slate-200 z-20">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-600 px-4 py-2 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started <Sparkles size={14} />
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 border-t border-slate-100 pt-4 pb-2 lg:hidden space-y-2">
            <Link
              href="/tutors"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Find Tutors
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              How it Works
            </Link>
            {!isTutor && (
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Become a Tutor
              </Link>
            )}
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md"
                >
                  Join SkillBridge
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
