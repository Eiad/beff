import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Check, X, Calendar, Loader2, Mail, Building2, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api/axios';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    document.title = 'Profile \u2014 B-eff';
  }, []);

  useEffect(() => {
    if (!editing) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelEdit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editing]);

  const startEdit = () => {
    setNameInput(user?.name ?? '');
    setNameError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setNameError('');
  };

  const saveName = async () => {
    if (nameInput.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    setSavingName(true);
    setNameError('');
    try {
      const res = await api.patch<{ name: string }>('/users/me', { name: nameInput.trim() });
      updateUser({ name: res.data.name });
      setEditing(false);
      toast('Name updated successfully');
    } catch {
      setNameError('Failed to save. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Profile</h1>

      {/* Profile header card with gradient banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-gray-100 shadow-sm overflow-hidden mb-5">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 relative">
            <div className="absolute inset-0 noise-overlay" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
          </div>

          <CardContent className="pt-0 pb-6 px-6">
            {/* Avatar overlapping the banner */}
            <div className="flex items-end gap-4 -mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg border-4 border-white">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="pb-1">
                {editing ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Input
                        id="name-edit"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="h-9 text-sm w-48"
                        autoFocus
                      />
                      <button
                        onClick={saveName}
                        disabled={savingName}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        aria-label="Save name"
                      >
                        {savingName ? (
                          <Loader2 size={16} className="animate-spin text-emerald-600" />
                        ) : (
                          <Check size={16} className="text-emerald-600" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Cancel edit"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    {nameError && <p className="text-xs text-red-600">{nameError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-lg">{user?.name}</span>
                    <button
                      onClick={startEdit}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Edit name"
                    >
                      <Pencil size={13} className="text-gray-400" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-gray-700 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">Joined</p>
                  <p className="text-sm text-gray-700">{memberSince}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">Company</p>
                  <p className="text-sm text-gray-400 italic">Not set</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm text-gray-400 italic">Not set</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan/Subscription card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <Card className="border-gray-100 shadow-sm mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <Globe size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Early Access</p>
                  <p className="text-xs text-gray-500">Founding member \u2014 priority onboarding</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.16 }}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Teams', value: '3', color: 'from-blue-500 to-indigo-600' },
            { label: 'Reports', value: '12', color: 'from-purple-500 to-violet-600' },
            { label: 'CO\u2082 Saved', value: '47t', color: 'from-emerald-500 to-teal-600' },
          ].map((stat) => (
            <Card key={stat.label} className="border-gray-100 shadow-sm overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
