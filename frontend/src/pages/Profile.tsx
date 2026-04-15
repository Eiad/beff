import { useEffect, useState } from 'react';
import { Pencil, Download, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import axios from 'axios';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    document.title = 'Profile — B-eff';
  }, []);

  // Cancel on Escape key
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
    } catch {
      // fail silently — user can retry
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>

        {/* User info */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-brand flex items-center justify-center text-white text-xl font-semibold shrink-0">
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
                        className="h-8 text-sm w-48"
                        autoFocus
                      />
                      <button
                        onClick={saveName}
                        disabled={savingName}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label="Save name"
                      >
                        <Check size={16} className="text-primary-brand" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label="Cancel edit"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    {nameError && <p className="text-xs text-red-600">{nameError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{user?.name}</span>
                    <button
                      onClick={startEdit}
                      className="p-1 rounded hover:bg-gray-100"
                      aria-label="Edit name"
                    >
                      <Pencil size={14} className="text-gray-400" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <Label className="text-xs text-gray-400">Member since</Label>
                <p className="text-sm text-gray-700 mt-0.5">{memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy — GDPR */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GDPR 1: Data portability */}
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
                <Download size={14} />
                {exportLoading ? 'Exporting…' : 'Export'}
              </Button>
            </div>

            <div className="border-t border-gray-100" />

            {/* GDPR 2: Right to erasure */}
            <div className="flex items-start justify-between gap-4">
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
      </main>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete your account?"
        description="This will permanently delete your B-eff account and all your data. This action cannot be undone."
        confirmLabel="Delete Account"
        loading={deleteLoading}
      />
    </div>
  );
}
