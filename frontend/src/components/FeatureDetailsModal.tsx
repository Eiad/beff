import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Tag, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

type FeatureKey = 'carbon' | 'compliance' | 'engagement';

interface FeatureDetails {
  title: string;
  description: string;
  detailedDescription: string;
  capabilities: string[];
  tags: string[];
  useCases: { title: string; description: string }[];
}

const FEATURE_DETAILS: Record<FeatureKey, FeatureDetails> = {
  carbon: {
    title: 'Carbon Intelligence',
    description:
      'Real-time CO\u2082 tracking across your fleet and operations. Understand your footprint with actionable insights, not just raw data.',
    detailedDescription:
      'B-eff\u2019s Carbon Intelligence module gives your organisation a live, data-driven view of emissions across Scope 1, 2, and 3. Instead of spreadsheets and quarterly surprises, your teams get continuous monitoring with automated alerts when thresholds are crossed.',
    capabilities: [
      'Real-time fleet and facility emissions tracking',
      'Scope 1, 2, and 3 emissions breakdown',
      'Automated threshold alerts and anomaly detection',
      'Historical trend analysis with benchmarking',
      'Exportable reports for stakeholder presentations',
    ],
    tags: ['CO\u2082 Analytics', 'Fleet Monitoring', 'ESG Reporting', 'Scope 1-3', 'Benchmarking'],
    useCases: [
      {
        title: 'Fleet Optimisation',
        description: 'Identify high-emission routes and vehicles, then track the impact of switching to EV or hybrid alternatives.',
      },
      {
        title: 'Emissions Benchmarking',
        description: 'Compare your performance against industry averages and set data-backed reduction targets.',
      },
    ],
  },
  compliance: {
    title: 'Compliance Automation',
    description:
      'Stay ahead of ESG regulations automatically. B-eff monitors regulatory changes and keeps your reports audit-ready.',
    detailedDescription:
      'Regulatory landscapes shift constantly. B-eff\u2019s Compliance Automation watches for changes to CSRD, GHG Protocol, ISO 14001, and dozens of other frameworks \u2014 then maps them to your reporting obligations so nothing slips through.',
    capabilities: [
      'Automated regulatory change monitoring',
      'Audit-ready report generation',
      'Framework mapping (CSRD, GHG Protocol, ISO 14001)',
      'Compliance score tracking with gap analysis',
      'Deadline reminders and submission tracking',
    ],
    tags: ['CSRD', 'GHG Protocol', 'ISO 14001', 'Audit-Ready', 'Regulatory Tracking'],
    useCases: [
      {
        title: 'Quarterly ESG Reporting',
        description: 'Generate compliant reports automatically with data pulled directly from your sustainability metrics.',
      },
      {
        title: 'Regulation Change Tracking',
        description: 'Get notified when new regulations affect your industry, with clear action items for your compliance team.',
      },
    ],
  },
  engagement: {
    title: 'Team Engagement',
    description:
      'Enroll teams, set sustainability goals, and celebrate milestones. Green culture starts with visibility and recognition.',
    detailedDescription:
      'Sustainability targets only work when people buy in. B-eff\u2019s Team Engagement tools let you set department-level goals, run challenges, and publicly recognise the teams making the biggest impact \u2014 turning green goals into a shared mission.',
    capabilities: [
      'Department and team goal setting',
      'Milestone tracking with progress dashboards',
      'Leaderboards and recognition system',
      'Sustainability challenge campaigns',
      'Impact visualisation per team and individual',
    ],
    tags: ['Green Goals', 'Gamification', 'Team Metrics', 'Leaderboards', 'Culture'],
    useCases: [
      {
        title: 'Department Challenges',
        description: 'Run monthly sustainability challenges across departments and track who reduces the most waste or emissions.',
      },
      {
        title: 'Sustainability KPIs',
        description: 'Set measurable green KPIs for each team and visualise progress in real-time on shared dashboards.',
      },
    ],
  },
};

interface FeatureDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureKey: FeatureKey;
}

export default function FeatureDetailsModal({ isOpen, onClose, featureKey }: FeatureDetailsModalProps) {
  const feature = FEATURE_DETAILS[featureKey];

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div
            key="modal-wrapper"
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-400" />
              </button>

              {/* Title */}
              <div className="mb-5 pr-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{feature.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>

              {/* Detailed description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb size={15} className="text-amber-500" />
                  Overview
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.detailedDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Capabilities */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Key Capabilities
                  </h3>
                  <ul className="space-y-2">
                    {feature.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={15} className="text-blue-500" />
                    Focus Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {feature.useCases.map((uc) => (
                    <div
                      key={uc.title}
                      className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{uc.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link to="/register" onClick={onClose}>
                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                  Join the Waitlist <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export type { FeatureKey };
