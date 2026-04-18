import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Leaf, Users, ShieldCheck, FileText, Plus, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import PageTransition from '../components/PageTransition';
import { SkeletonCard, SkeletonActivity } from '../components/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import type { StatCard, ActivityItem } from '../types';

const STATS: StatCard[] = [
  { label: 'Fleet CO\u2082 Reduced', value: '142', unit: 'tonnes', trend: '+12%', trendUp: true, icon: 'leaf' },
  { label: 'Teams Enrolled', value: '8', unit: 'teams', trend: '+2', trendUp: true, icon: 'users' },
  { label: 'Compliance Score', value: '94', unit: '%', trend: '+3%', trendUp: true, icon: 'shield' },
  { label: 'Reports Generated', value: '31', unit: 'reports', trend: '-1', trendUp: false, icon: 'file' },
];

const ACTIVITIES: ActivityItem[] = [
  { id: '1', description: 'Fleet report Q1 2025 generated', timestamp: '2 hours ago' },
  { id: '2', description: 'Engineering team enrolled in green goals programme', timestamp: '5 hours ago' },
  { id: '3', description: 'CO\u2082 reduction milestone hit: 100 tonnes saved', timestamp: 'Yesterday' },
  { id: '4', description: 'Compliance audit completed \u2014 score: 94%', timestamp: '3 days ago' },
  { id: '5', description: 'New ESG regulation added to monitoring scope', timestamp: '1 week ago' },
];

const ICON_MAP = { leaf: Leaf, users: Users, shield: ShieldCheck, file: FileText };
const ACCENT_MAP = {
  leaf: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600', light: 'text-emerald-500' },
  users: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600', light: 'text-blue-500' },
  shield: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600', light: 'text-amber-500' },
  file: { gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-600', light: 'text-purple-500' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard \u2014 Beff';
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-6xl">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-6 py-6 sm:px-8 sm:py-8 mb-6"
      >
        <div className="absolute inset-0 noise-overlay rounded-2xl" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Welcome back, {user?.name ?? 'there'}
          </h1>
          <p className="text-emerald-100/70 text-sm mt-1">{today}</p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : STATS.map((stat, i) => {
              const Icon = ICON_MAP[stat.icon as keyof typeof ICON_MAP];
              const accent = ACCENT_MAP[stat.icon as keyof typeof ACCENT_MAP];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group"
                >
                  <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative">
                    {/* Top accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${accent.gradient}`} />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-sm`}>
                          <Icon size={15} className="text-white" />
                        </div>
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                          stat.trendUp ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {stat.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1.5">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
          <CardHeader className="pb-2 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-900">Recent Activity</CardTitle>
              <span className="text-xs text-emerald-600 font-medium cursor-pointer hover:text-emerald-700">View all</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonActivity key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-200 via-emerald-100 to-transparent" />
                <ul className="space-y-0">
                  {ACTIVITIES.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-3 py-2.5 px-1 rounded-lg hover:bg-gray-50/80 transition-colors relative"
                    >
                      <div className="w-[11px] h-[11px] rounded-full bg-emerald-500 border-2 border-white mt-1.5 shrink-0 relative z-10 shadow-sm" />
                      <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{item.description}</p>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">{item.timestamp}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2 px-5">
            <CardTitle className="text-sm font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-5 pb-5">
            {[
              { icon: Plus, label: 'Add Team', desc: 'Create a new team', color: 'from-emerald-500 to-teal-600' },
              { icon: FileText, label: 'Generate Report', desc: 'Create ESG report', color: 'from-blue-500 to-indigo-600' },
              { icon: Download, label: 'Export Data', desc: 'Download as CSV', color: 'from-purple-500 to-violet-600' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200 text-left group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm shrink-0`}>
                  <action.icon size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-[11px] text-gray-400">{action.desc}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
