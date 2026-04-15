import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Leaf, Users, ShieldCheck, FileText, Plus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import type { StatCard, ActivityItem } from '../types';

// Mock data — replace with API when backend stats endpoint is added
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

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard — B-eff';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-20 pb-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name ?? 'there'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's your sustainability overview.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => {
            const Icon = ICON_MAP[stat.icon as keyof typeof ICON_MAP];
            return (
              <Card key={stat.label}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-brand-light flex items-center justify-center">
                      <Icon size={16} className="text-primary-brand" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${stat.trendUp ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}
                    >
                      {stat.trendUp ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ACTIVITIES.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-brand mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <p className="text-xs text-gray-400">{item.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                <Plus size={14} /> Add Team
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                <FileText size={14} /> Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                <Download size={14} /> Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
