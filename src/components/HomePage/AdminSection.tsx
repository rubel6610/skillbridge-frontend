// components/sections/AdminSection.tsx
import React from 'react';
import { Shield, Users, BarChart, Settings, Activity, Flag, Database, Globe, Lock, Bell, TrendingUp, UserCheck } from 'lucide-react';

const AdminSection = () => {
  const adminCapabilities = [
    {
      icon: Users,
      title: 'User Management',
      description: 'View, approve, suspend, or verify tutors and students. Manage roles and permissions.',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: BarChart,
      title: 'Platform Analytics',
      description: 'Real-time dashboards for sessions, revenue, active users, and platform growth metrics.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Review reported content, manage disputes, and enforce community guidelines.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure platform fees, session limits, promotional campaigns, and feature flags.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const adminStats = [
    { label: 'Active Users', value: '6,842', change: '+12%', icon: UserCheck },
    { label: 'Monthly Sessions', value: '3,241', change: '+23%', icon: Activity },
    { label: 'Platform Revenue', value: '$48.2K', change: '+18%', icon: TrendingUp },
    { label: 'Avg Response Time', value: '2.4hrs', change: '-31%', icon: Bell }
  ];

  const recentActivities = [
    { action: 'New tutor application', user: 'Sarah Chen', time: '5 mins ago', status: 'pending' },
    { action: 'Payment dispute raised', user: 'Michael R.', time: '1 hour ago', status: 'urgent' },
    { action: 'System update completed', user: 'System', time: '3 hours ago', status: 'success' },
    { action: 'Flagged content review', user: 'Mod Team', time: '5 hours ago', status: 'review' }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900 text-white">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 mb-5">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Admin Dashboard</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Complete Platform Oversight
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Powerful administrative tools to manage users, monitor platform health, 
            and ensure a safe, high-quality learning environment.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminStats.map((stat, idx) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+');
            return (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-indigo-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Admin capabilities */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-400" />
              Key Administrative Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {adminCapabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div key={idx} className="bg-slate-800/40 rounded-xl p-5 border border-slate-700 hover:bg-slate-800/60 transition">
                    <div className={`w-11 h-11 rounded-lg bg-gradient-to-r ${cap.gradient} bg-opacity-20 flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{cap.title}</h4>
                    <p className="text-slate-400 text-sm">{cap.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity feed */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Recent Activity
              </h3>
              <button className="text-indigo-400 text-sm hover:text-indigo-300">View all →</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-700 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'urgent' ? 'bg-red-500' : 
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin tools grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Lock, label: 'Access Controls', color: 'bg-indigo-900/40' },
            { icon: Flag, label: 'Reports Queue', color: 'bg-red-900/40' },
            { icon: Globe, label: 'Platform Settings', color: 'bg-emerald-900/40' },
            { icon: Bell, label: 'Announcements', color: 'bg-amber-900/40' }
          ].map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div key={idx} className={`${tool.color} rounded-xl p-4 text-center border border-white/10 hover:border-white/30 transition cursor-pointer group`}>
                <Icon className="w-6 h-6 text-white/80 mx-auto mb-2 group-hover:scale-110 transition" />
                <div className="text-sm font-medium text-white/90">{tool.label}</div>
              </div>
            );
          })}
        </div>

        {/* Security notice */}
        <div className="mt-12 text-center text-slate-400 text-sm flex justify-center items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Role-based access control • Audit logs • GDPR & COPPA compliant</span>
        </div>
      </div>
    </section>
  );
};

export default AdminSection;