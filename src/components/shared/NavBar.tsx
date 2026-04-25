// components/shared/NavBar.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tutors", href: "/tutors" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about-us" },
];

const getUserMenuItems = (role?: string) => {
  if (role === "TUTOR") {
    return [{ label: "Dashboard", href: "/tutor/dashboard" }];
  }

  if (role === "ADMIN") {
    return [{ label: "Admin Panel", href: "/admin" }];
  }

  return [{ label: "Dashboard", href: "/student/dashboard" }];
};

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoading, logout, getDashboardRoute } = useAuth();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const userMenuItems = useMemo(
    () => getUserMenuItems(user?.role),
    [user?.role],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsUserMenuOpen(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl font-bold text-transparent">
                SkillBridge
              </span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl font-bold text-transparent">
              SkillBridge
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div
                ref={menuRef}
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-blue-200 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </div>
                    <div className="text-xs capitalize text-slate-500">
                      {user.role?.toLowerCase()}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
                    <div className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.email || "Signed in user"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-gray-100 pt-3">
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <UserCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs capitalize text-gray-500">
                        {user.role?.toLowerCase()}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={getDashboardRoute()}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {userMenuItems
                    .filter((item) => item.href !== getDashboardRoute())
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="mt-1 block rounded-lg bg-blue-600 px-3 py-2 text-center text-white transition-colors hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
