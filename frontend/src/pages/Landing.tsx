import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, BarChart2, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import GeometricGrid from '../components/GeometricGrid';
import AnimatedLogo from '../components/AnimatedLogo';
import ScrollIndicator from '../components/ScrollIndicator';
import Navbar from '../components/Navbar';
import FeatureDetailsModal, { type FeatureKey } from '../components/FeatureDetailsModal';

const FEATURES: { icon: typeof BarChart2; title: string; description: string; key: FeatureKey; accent: { bg: string; text: string; border: string }; num: string }[] = [
  {
    icon: BarChart2,
    key: 'carbon',
    title: 'Carbon Intelligence',
    description: 'Real-time CO₂ tracking across your fleet and operations. Understand your footprint with actionable insights, not just raw data.',
    accent: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'from-emerald-200 via-teal-100 to-emerald-200' },
    num: '01',
  },
  {
    icon: Shield,
    key: 'compliance',
    title: 'Compliance Automation',
    description: 'Stay ahead of ESG regulations automatically. B-eff monitors regulatory changes and keeps your reports audit-ready.',
    accent: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'from-blue-200 via-sky-100 to-blue-200' },
    num: '02',
  },
  {
    icon: Zap,
    key: 'engagement',
    title: 'Team Engagement',
    description: 'Enroll teams, set sustainability goals, and celebrate milestones. Green culture starts with visibility and recognition.',
    accent: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'from-amber-200 via-yellow-100 to-amber-200' },
    num: '03',
  },
];

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>('carbon');

  const handleFeatureClick = (key: FeatureKey) => {
    setSelectedFeature(key);
    setModalOpen(true);
  };

  useEffect(() => {
    document.title = 'B-eff | Greener Business, Together';
  }, []);

  return (
    <div className="relative">
      <GeometricGrid />
      <Navbar />
      <FeatureDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        featureKey={selectedFeature}
      />

      <main>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-14 relative overflow-hidden">
        {/* Background blob */}
        <div className="hero-blob top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Badge variant="outline" className="text-xs font-medium px-4 py-1.5 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            500+ companies already on the waitlist
          </Badge>
        </motion.div>

        <AnimatedLogo />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-xl text-gray-500 text-lg leading-relaxed"
        >
          The B2B sustainability platform that turns green goals into measurable business results.
          Built for teams that want to do better — and prove it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-center"
        >
          <Link to="/register">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-200"
            >
              Join the Waitlist <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg" className="text-gray-600 hover:text-emerald-700">See how it works</Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-10"
        >
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3 block"
          >
            Platform
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 mb-4">
            Everything your team needs to <span className="text-gradient-emerald">go green</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            B-eff brings sustainability metrics, compliance, and engagement into one platform designed for modern B2B teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              onClick={() => handleFeatureClick(f.key)}
              className="group relative cursor-pointer"
            >
              {/* Gradient border wrapper */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 group-hover:border-transparent p-7 transition-all duration-300 group-hover:shadow-xl h-full">
                {/* Faded number */}
                <span className="absolute top-4 right-5 text-4xl font-bold text-gray-100 group-hover:text-emerald-100 transition-colors select-none">{f.num}</span>

                <div className={`w-11 h-11 rounded-xl ${f.accent.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={20} className={f.accent.text} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-emerald-600 group-hover:gap-2 transition-all duration-200">
                  Learn more <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-gradient-to-b from-emerald-50/40 via-white to-white py-24 relative">
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          {/* Decorative quotes */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[120px] leading-none text-emerald-100/60 font-serif select-none pointer-events-none">&ldquo;</span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <Leaf size={24} className="text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 mb-4">
              Why <span className="text-gradient-emerald">B-eff</span>?
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4 text-lg">
              Sustainability shouldn&apos;t be a compliance checkbox. It should be a <strong className="text-gray-700">competitive advantage</strong>.
              B-eff is built for the companies that understand this — and want the tools to act on it.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We&apos;re in pre-launch, working closely with our early access partners to build exactly what
              forward-thinking B2B teams need. Join the waitlist and help shape the product.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl px-8 py-14 sm:px-16 sm:py-16 text-center overflow-hidden"
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 noise-overlay rounded-3xl" />
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white mb-4">
              Be among the first
            </h2>
            <p className="text-emerald-100/80 mb-8 max-w-lg mx-auto">
              Early access partners get priority onboarding, direct input on the roadmap, and founding member pricing.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 font-semibold">
                Request Early Access <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      </main>
      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-emerald-600" />
            <span className="font-serif">B-eff</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <p>© {new Date().getFullYear()} B-eff. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
