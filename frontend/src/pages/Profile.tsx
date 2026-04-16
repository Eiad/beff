import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Pencil, Download, Trash2, Check, X, Calendar, Shield, Bell,
  Smartphone, Lock, Loader2, LogIn, FileText, UserCog,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import PageTransition from '../components/PageTransition';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api/axios';
import axios from 'axios';

const NOTIFICATION_PREFS = [
  { id: 'email-reports', label: 'Email reports', description: 'Receive weekly sustainability reports via email' },
  { id: 'compliance-alerts', label: 'Compliance alerts', description: 'Get notified about regulatory changes' },
  { id: 'team-updates', label: 'Team updates', description: 'Notifications when teams hit milestones' },
];

const ACTIVITY_LOG = [
  { action: 'Logged in', icon: LogIn, timestamp: 'Today at 2:34 PM' },
  { action: 'Exported account data', icon: Download, timestamp: 'Yesterday at 11:20 AM' },
  { action: 'Updated display name', icon: UserCog, timestamp: '3 days ago' },
  { action: 'Generated Q1 report', icon: FileText, timestamp: '1 week ago' },
  { action: 'Logged in', icon: LogIn, timestamp: '1 week ago' },
];

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    'email-reports': true,
    'compliance-alerts': true,
    'team-updates': false,
  });

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

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await api.get('/users/me/export', { responseType: 'blob' });
      const date = new Date().toISOString().split('T')[0];
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beff-data-export-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Data export started');
    } catch {
      toast('Export failed. Please try again.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete('/users/me');
      logout();
      window.location.href = '/';
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        setDeleteLoading(false);
        setDeleteOpen(false);
      }
    }
  };

  const toggleNotif = (id: string) => {
    setNotifPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    toast('Preference updated');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';

  const sectionDelay = (i: number) => ({ duration: 0.3, delay: i * 0.08 });

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(0)}>
        <Card className="mb-6 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-semibold shrink-0 shadow-sm">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div>
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
                    <span className="font-medium text-gray-900 text-lg">{user?.name}</span>
                    <button
                      onClick={startEdit}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Edit name"
                    >
                      <Pencil size={14} className="text-gray-400" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-sm text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              Member since {memberSince}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(1)}>
        <Card className="mb-6 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield size={16} className="text-gray-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Change password</p>
                <p className="text-xs text-gray-500 mt-0.5">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" disabled className="text-gray-400">
                <Lock size={14} className="mr-1.5" />
                Update
              </Button>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Two-factor authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
              </div>
              <button
                className="relative w-10 h-6 rounded-full bg-gray-200 transition-colors cursor-not-allowed"
                disabled
                aria-label="Two-factor authentication toggle (coming soon)"
              >
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
              </button>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Smartphone size={14} className="text-gray-400" />
              Last login: Today at 2:34 PM
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(2)}>
        <Card className="mb-6 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell size={16} className="text-gray-400" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {NOTIFICATION_PREFS.map((pref, i) => (
              <div key={pref.id}>
                {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{pref.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{pref.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(pref.id)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifPrefs[pref.id] ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                    aria-label={`Toggle ${pref.label}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        notifPrefs[pref.id] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(3)}>
        <Card className="mb-6 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Export your data</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Download a copy of all the data B-eff holds about your account.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exportLoading}
                className="shrink-0 gap-1.5"
              >
                {exportLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {exportLoading ? 'Exporting...' : 'Export'}
              </Button>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex items-start justify-between gap-4 bg-red-50/50 -mx-6 px-6 py-4 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-600">Delete account</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="shrink-0 gap-1.5"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(4)}>
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-0">
              {ACTIVITY_LOG.map((entry, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-2.5 text-sm border-b border-gray-50 last:border-0"
                >
                  <entry.icon size={15} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 flex-1">{entry.action}</span>
                  <span className="text-xs text-gray-400">{entry.timestamp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete your account?"
        description="This will permanently delete your B-eff account and all your data. This action cannot be undone."
        confirmLabel="Delete Account"
        confirmText="delete my account"
        loading={deleteLoading}
      />
    </PageTransition>
  );
}
