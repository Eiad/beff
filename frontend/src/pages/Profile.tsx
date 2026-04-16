import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Check, X, Calendar, Loader2 } from 'lucide-react';
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

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Account</CardTitle>
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
    </PageTransition>
  );
}
