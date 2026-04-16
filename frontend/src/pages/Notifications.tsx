import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/Toast';

const NOTIFICATION_PREFS = [
  { id: 'email-reports', label: 'Email reports', description: 'Receive weekly sustainability reports via email' },
  { id: 'compliance-alerts', label: 'Compliance alerts', description: 'Get notified about regulatory changes' },
  { id: 'team-updates', label: 'Team updates', description: 'Notifications when teams hit milestones' },
  { id: 'product-updates', label: 'Product updates', description: 'News about B-eff features and improvements' },
];

export default function Notifications() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    'email-reports': true,
    'compliance-alerts': true,
    'team-updates': false,
    'product-updates': true,
  });

  useEffect(() => {
    document.title = 'Notifications \u2014 B-eff';
  }, []);

  const toggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    toast('Preference updated');
  };

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Notifications</h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Email Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {NOTIFICATION_PREFS.map((pref, i) => (
              <div key={pref.id} className={`flex items-center justify-between py-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{pref.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pref.description}</p>
                </div>
                <button
                  onClick={() => toggle(pref.id)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    prefs[pref.id] ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                  aria-label={`Toggle ${pref.label}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      prefs[pref.id] ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </PageTransition>
  );
}
