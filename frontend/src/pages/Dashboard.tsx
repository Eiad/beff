import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Leaf, Users, ShieldCheck, FileText, Plus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import PageTransition from '../components/PageTransition';
import { SkeletonCard, SkeletonActivity } from '../components/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import type { StatCard, ActivityItem } from '../types';

const STATS: StatCard[] = [
  { label: 'Fleet CO₂ Reduced', value: '142', unit: 'tonnes', trend: '+12%', trendUp: true, icon: 'leaf' },
  { label: 'Teams Enrolled', value: '8', unit: 'teams', trend: '+2', trendUp: true, icon: 'users' },
  { label: 'Compliance Score', value: '94', unit: '%', trend: '+3%', trendUp: true, icon: 'shield' },
  { label: 'Reports Generated', value: '31', unit: 'reports', trend: '-1', trendUp: false, icon: 'file' },
];

const ACTIVITIES: ActivityItem[] = [
  { id: '1', description: 'Fleet report Q1 2025 generated', timestamp: '2 hours ago' },
  { id: '2', description: 'Engineering team enrolled in green goals programme', timestamp: '5 hours ago' },
  { id: '3', description: 'CO₂ reduction milestone hit: 100 tonnes saved', timestamp: 'Yesterday' },
  { id: '4', description: 'Compliance audit completed — score: 94%', timestamp: '3 days ago' },
  { id: '5', description: 'New ESG regulation added to monitoring scope', timestamp: '1 week ago' },
];

const ICON_MAP = { leaf: Leaf, users: Users, shield: ShieldCheck, file: FileText };
const ACCENT_MAP = {
  leaf: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  users: { bg: 'bg-blue-50', text: 'text-blue-600' },
  shield: { bg: 'bg-amber-50', text: 'text-amber-600' },
  file: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — B-eff';
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
    <PageTransition className="px-6 lg:px-10 pt-8 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name ?? 'there'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
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
                >
                  <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center`}>
                          <Icon size={20} className={accent.text} />
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${
                            stat.trendUp
                              ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                              : 'text-red-500 border-red-200 bg-red-50'
                          }`}
                        >
                          {stat.trendUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                          {stat.trend}
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonActivity key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[5px] top-3 bottom-3 w-px bg-gray-100" />
                <ul className="space-y-0">
                  {ACTIVITIES.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-gray-50/50 transition-colors relative"
                    >
                      <div className="w-[11px] h-[11px] rounded-full bg-emerald-500 border-2 border-white mt-1.5 shrink-0 relative z-10" />
                      <div className="flex-1 flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-700">{item.description}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{item.timestamp}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              { icon: Plus, label: 'Add Team' },
              { icon: FileText, label: 'Generate Report' },
              { icon: Download, label: 'Export Data' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-3 text-sm h-11 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
              >
                <action.icon size={16} className="text-gray-500" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
