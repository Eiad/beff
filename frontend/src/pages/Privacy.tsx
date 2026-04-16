import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Trash2, Loader2, LogIn, FileText, UserCog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import PageTransition from '../components/PageTransition';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api/axios';
import axios from 'axios';

const ACTIVITY_LOG = [
  { action: 'Logged in', icon: LogIn, timestamp: 'Today at 2:34 PM' },
  { action: 'Exported account data', icon: Download, timestamp: 'Yesterday at 11:20 AM' },
  { action: 'Updated display name', icon: UserCog, timestamp: '3 days ago' },
  { action: 'Generated Q1 report', icon: FileText, timestamp: '1 week ago' },
  { action: 'Logged in', icon: LogIn, timestamp: '1 week ago' },
];

export default function Privacy() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    document.title = 'Data & Privacy \u2014 B-eff';
  }, []);

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

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Data & Privacy</h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="mb-5 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Your Data</CardTitle>
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
                {exportLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {exportLoading ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <Card className="mb-5 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-0">
              {ACTIVITY_LOG.map((entry, i) => (
                <li key={i} className="flex items-center gap-3 py-2.5 text-sm border-b border-gray-50 last:border-0">
                  <entry.icon size={15} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 flex-1">{entry.action}</span>
                  <span className="text-xs text-gray-400">{entry.timestamp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.16 }}>
        <Card className="border-red-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Delete account</p>
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
