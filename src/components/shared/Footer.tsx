// components/layout/Footer.tsx
import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  Shield,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  Send,
  GraduationCap,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Success Stories", href: "/stories" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  const forStudents = [
    { name: "Find Tutors", href: "/tutors" },
    { name: "Browse Subjects", href: "/subjects" },
    { name: "Learning Paths", href: "/learning-paths" },
    { name: "Study Resources", href: "/resources" },
    { name: "Student FAQ", href: "/faq/students" },
    { name: "Scholarships", href: "/scholarships" },
  ];

  const forTutors = [
    { name: "Become a Tutor", href: "/become-tutor" },
    { name: "Tutor Dashboard", href: "/tutor-dashboard" },
    { name: "Teaching Tools", href: "/teaching-tools" },
    { name: "Tutor Resources", href: "/tutor-resources" },
    { name: "Tutor FAQ", href: "/faq/tutors" },
    { name: "Payment & Payouts", href: "/payments" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Safety Tips", href: "/safety" },
    { name: "Report an Issue", href: "/report" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/skillbridge",
      label: "Facebook",
      color: "text-[#1877f2]",
      bg: "bg-[#1877f2]/10",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/skillbridge",
      label: "Twitter",
      color: "text-[#1da1f2]",
      bg: "bg-[#1da1f2]/10",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/skillbridge",
      label: "Instagram",
      color: "text-[#e4405f]",
      bg: "bg-[#e4405f]/10",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/skillbridge",
      label: "LinkedIn",
      color: "text-[#0a66c2]",
      bg: "bg-[#0a66c2]/10",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/skillbridge",
      label: "YouTube",
      color: "text-[#ff0000]",
      bg: "bg-[#ff0000]/10",
    },
  ];

  const trustBadges = [
    {
      icon: Shield,
      text: "Secure Payments",
      description: "256-bit SSL encryption",
    },
    {
      icon: Clock,
      text: "24/7 Support",
      description: "Round-the-clock assistance",
    },
    {
      icon: Award,
      text: "Verified Tutors",
      description: "Rigorous screening process",
    },
    {
      icon: Globe,
      text: "Global Community",
      description: "100+ countries worldwide",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border-t border-indigo-100">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-16 max-w-7xl">
        {/* Top Section with Newsletter - Enhanced */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16 pb-10 border-b border-indigo-100">
          {/* Brand Section */}
          <div>
            <Logo />
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed mt-3">
              Connecting learners with expert tutors worldwide. Empowering
              education through technology and human connection.
            </p>

            {/* Social Links with new design */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                Connect with us
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-10 h-10 rounded-xl ${social.bg} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md`}
                      aria-label={social.label}
                    >
                      <Icon
                        className={`w-5 h-5 ${social.color} transition-transform group-hover:scale-110`}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newsletter Signup - Enhanced */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h4 className="text-lg font-semibold text-gray-800">
                Stay Updated
              </h4>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Get the latest updates on new tutors, courses, and exclusive
              offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="group px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              No spam, unsubscribe anytime
            </p>
          </div>
        </div>

        {/* Trust Badges - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 py-8 px-6 bg-white/50 rounded-2xl border border-indigo-100">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition group"
              >
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {badge.text}
                  </p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 pt-8 border-t border-indigo-100">
          <div className="flex flex-wrap justify-center gap-6">
            {support.slice(4, 6).map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-xs text-gray-500 hover:text-indigo-600 transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cookies"
              className="text-xs text-gray-500 hover:text-indigo-600 transition"
            >
              Cookie Policy
            </Link>
            <Link
              href="/accessibility"
              className="text-xs text-gray-500 hover:text-indigo-600 transition"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
