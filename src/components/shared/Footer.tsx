// components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
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
  Award
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' }
  ];

  const forStudents = [
    { name: 'Find Tutors', href: '/tutors' },
    { name: 'Browse Subjects', href: '/subjects' },
    { name: 'Learning Paths', href: '/learning-paths' },
    { name: 'Study Resources', href: '/resources' },
    { name: 'Student FAQ', href: '/faq/students' },
    { name: 'Scholarships', href: '/scholarships' }
  ];

  const forTutors = [
    { name: 'Become a Tutor', href: '/become-tutor' },
    { name: 'Tutor Dashboard', href: '/tutor-dashboard' },
    { name: 'Teaching Tools', href: '/teaching-tools' },
    { name: 'Tutor Resources', href: '/tutor-resources' },
    { name: 'Tutor FAQ', href: '/faq/tutors' },
    { name: 'Payment & Payouts', href: '/payments' }
  ];

  const support = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Safety Tips', href: '/safety' },
    { name: 'Report an Issue', href: '/report' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/skillbridge', label: 'Facebook', color: 'hover:bg-[#1877f2]' },
    { icon: Twitter, href: 'https://twitter.com/skillbridge', label: 'Twitter', color: 'hover:bg-[#1da1f2]' },
    { icon: Instagram, href: 'https://instagram.com/skillbridge', label: 'Instagram', color: 'hover:bg-[#e4405f]' },
    { icon: Linkedin, href: 'https://linkedin.com/company/skillbridge', label: 'LinkedIn', color: 'hover:bg-[#0a66c2]' },
    { icon: Youtube, href: 'https://youtube.com/skillbridge', label: 'YouTube', color: 'hover:bg-[#ff0000]' }
  ];

  const trustBadges = [
    { icon: Shield, text: 'Secure Payments' },
    { icon: Clock, text: '24/7 Support' },
    { icon: Award, text: 'Verified Tutors' },
    { icon: Globe, text: 'Global Community' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        
        {/* Top Section with Newsletter */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 pb-8 border-b border-gray-800">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              SkillBridge
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting learners with expert tutors worldwide. Empowering education through technology and human connection.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest updates on new tutors, courses, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500 mt-1"></span>
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              For Students
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500 mt-1"></span>
            </h4>
            <ul className="space-y-2">
              {forStudents.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              For Tutors
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500 mt-1"></span>
            </h4>
            <ul className="space-y-2">
              {forTutors.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500 mt-1"></span>
            </h4>
            <ul className="space-y-2 mb-4">
              {support.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a href="mailto:support@skillbridge.com" className="hover:text-indigo-400 transition">
                  support@skillbridge.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-indigo-400" />
                <a href="tel:+18005551234" className="hover:text-indigo-400 transition">
                  +1 (800) 555-1234
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>123 Learning Lane, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>© {currentYear} SkillBridge.</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-indigo-400 transition text-xs">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-indigo-400 transition text-xs">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-indigo-400 transition text-xs">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-indigo-400 transition text-xs">
              Accessibility
            </Link>
          </div>

      
        </div>
      </div>
    </footer>
  );
};

export default Footer;