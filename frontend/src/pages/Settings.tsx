import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import PageTransition from '../components/PageTransition';

export default function Settings() {
  useEffect(() => {
    document.title = 'Security \u2014 Beff';
  }, []);

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Security</h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="mb-5 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield size={15} className="text-gray-400" />
              Password
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <Card className="mb-5 border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Enable 2FA</p>
                <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
              </div>
              <button
                className="relative w-10 h-6 rounded-full bg-gray-200 transition-colors cursor-not-allowed"
                disabled
                aria-label="Two-factor authentication toggle (coming soon)"
              >
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.16 }}>
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Login Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Smartphone size={14} className="text-gray-400" />
              Last login: Today at 2:34 PM
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageTransition>
  );
}
