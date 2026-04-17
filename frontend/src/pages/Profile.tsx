import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Check, X, Calendar, Loader2, Mail, Building2, MapPin, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
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

  useEffect(() => { document.title = 'Profile \u2014 B-eff'; }, []);

  useEffect(() => {
    if (!editing) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelEdit(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editing]);

  const startEdit = () => { setNameInput(user?.name ?? ''); setNameError(''); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setNameError(''); };

  const saveName = async () => {
    if (nameInput.trim().length < 2) { setNameError('Name must be at least 2 characters'); return; }
    setSavingName(true); setNameError('');
    try {
      const res = await api.patch<{ name: string }>('/users/me', { name: nameInput.trim() });
      updateUser({ name: res.data.name }); setEditing(false); toast('Name updated successfully');
    } catch { setNameError('Failed to save. Please try again.'); }
    finally { setSavingName(false); }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Profile</h1>

      {/* User card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-gray-100 shadow-sm mb-5">
          <CardContent className="p-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Input id="name-edit" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="h-9 text-sm w-48" autoFocus />
                      <button onClick={saveName} disabled={savingName} className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" aria-label="Save name">
                        {savingName ? <Loader2 size={16} className="animate-spin text-emerald-600" /> : <Check size={16} className="text-emerald-600" />}
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Cancel edit">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    {nameError && <p className="text-xs text-red-600">{nameError}</p>}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-lg">{user?.name}</span>
                      <button onClick={startEdit} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Edit name">
                        <Pencil size={13} className="text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </>
                )}
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shrink-0">
                Early Access
              </span>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: user?.email ?? '\u2014' },
                { icon: Calendar, label: 'Member since', value: memberSince },
                { icon: Building2, label: 'Company', value: null },
                { icon: MapPin, label: 'Location', value: null },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-2 border-t border-gray-50 first:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <item.icon size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 w-28 shrink-0">{item.label}</span>
                  <span className={`text-sm ${item.value ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                    {item.value ?? 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription + Stats row */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <Card className="border-gray-100 shadow-sm mb-5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
                <Globe size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Early Access Plan</p>
                <p className="text-xs text-gray-500">Founding member &mdash; priority onboarding &amp; roadmap input</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Teams', value: '3', gradient: 'from-emerald-500 to-teal-600' },
                { label: 'Reports', value: '12', gradient: 'from-blue-500 to-indigo-600' },
                { label: 'CO\u2082 Saved', value: '47t', gradient: 'from-purple-500 to-violet-600' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-gray-50 p-4 text-center relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient}`} />
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageTransition>
  );
}
